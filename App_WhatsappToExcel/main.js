const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const cors = require('cors');
const qrcodeTerminal = require('qrcode-terminal');
const config = require('./config');
const { createMenu } = require('./menu');
const { createTray, updateTrayIcon, destroyTray } = require('./tray');
let mainWindow;
let server;
let client;
let contacts = [];
let lastQr = null;
let isReady = false;

// Configuración del servidor Express
function createServer() {
    const expressApp = express();
    let PORT = config.server.port;
    
    // Función para encontrar un puerto disponible
    const findAvailablePort = (startPort) => {
        return new Promise((resolve, reject) => {
            const server = require('net').createServer();
            server.listen(startPort, () => {
                const port = server.address().port;
                server.close(() => resolve(port));
            });
            server.on('error', () => {
                resolve(findAvailablePort(startPort + 1));
            });
        });
    };

    expressApp.use(cors());
    expressApp.use(express.json());
    expressApp.use(express.static(path.join(__dirname, 'public')));

    // Inicializa el cliente de WhatsApp Web
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { 
            headless: config.whatsapp.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    // Evento: QR para iniciar sesión
    client.on('qr', async (qr) => {
        lastQr = await qrcode.toDataURL(qr);
        isReady = false;
        console.log('QR generado, esperando conexión...');
        mainWindow.webContents.send('qr-updated', { qr: lastQr });
    });

    // Evento: WhatsApp listo
    client.on('ready', async () => {
        isReady = true;
        lastQr = null;
        contacts = await client.getContacts();
        console.log('WhatsApp Web listo');
        console.log('Cantidad de contactos obtenidos:', contacts.length);
        mainWindow.webContents.send('whatsapp-ready');
        updateTrayIcon({ connected: true });
    });

    client.on('disconnected', (reason) => {
        isReady = false;
        lastQr = null;
        console.log('Desconectado de WhatsApp Web:', reason);
        mainWindow.webContents.send('whatsapp-disconnected', { reason });
        updateTrayIcon({ connected: false });
        client.destroy();
        setTimeout(() => client.initialize(), 2000);
    });

    client.initialize();

    // Función para obtener un nombre seguro para el archivo
    const getSafeName = (name) => {
        return (name || 'contacto')
            .normalize('NFD').replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-zA-Z0-9_\-]/g, '_')
            .substring(0, 30);
    };

    // Endpoint: obtener lista de contactos
    expressApp.get('/api/contacts', (req, res) => {
        if (!isReady) return res.status(503).json({ error: 'WhatsApp no está listo' });
        const simpleContacts = contacts.map(c => ({
            id: c.id._serialized,
            name: c.name || c.pushname || c.number
        }));
        res.json(simpleContacts);
    });

    // Endpoint: extraer mensajes de un contacto
    expressApp.post('/api/extract', async (req, res) => {
        const { contactId } = req.body;
        if (!isReady) return res.status(503).json({ error: 'WhatsApp no está listo' });
        try {
            const chat = await client.getChatById(contactId);
            const messages = await chat.fetchMessages({ limit: 5, force: true });
            console.log('Mensajes RAW obtenidos:', messages.map(m => ({ type: m.type, body: m.body, from: m.from, author: m.author, timestamp: m.timestamp })));
            const textMessages = messages.filter(m => m.type === 'chat' && m.body && m.body.trim() !== '').map(m => `${m.timestamp} - ${m.author || m.from}: ${m.body}`);
            console.log('Mensajes filtrados para guardar:', textMessages);
            
            // Carpeta de salida
            const contactName = getSafeName(chat.name || chat.id.user || chat.id._serialized);
            const now = new Date();
            const fecha = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
            const outDir = config.paths.extracciones;
            const contactDir = path.resolve(outDir, contactName);
            fs.mkdirSync(contactDir, { recursive: true });
            const filePath = path.join(contactDir, `mensajes_${contactName}_${fecha}.txt`);
            fs.writeFileSync(filePath, textMessages.join('\n'));
            console.log(`Archivo guardado en: ${filePath}`);
            
            // Notificar al frontend sobre la extracción exitosa
            mainWindow.webContents.send('extraction-complete', { 
                contactName, 
                filePath,
                messageCount: textMessages.length 
            });
            
            res.json({ success: true, file: filePath });
        } catch (err) {
            console.error('Error al guardar la extracción:', err);
            res.status(500).json({ error: err.message });
        }
    });

    // Endpoint para obtener el QR actual
    expressApp.get('/api/qr', (req, res) => {
        if (lastQr) {
            res.json({ qr: lastQr });
        } else {
            res.status(404).json({ error: 'No hay QR disponible' });
        }
    });

    // Endpoint para saber si está conectado
    expressApp.get('/api/status', (req, res) => {
        res.json({ connected: isReady });
    });

    // Endpoint para regenerar QR (reinicia el cliente)
    expressApp.post('/api/regen-qr', (req, res) => {
        isReady = false;
        lastQr = null;
        client.destroy();
        setTimeout(() => client.initialize(), 1000);
        res.json({ ok: true });
    });

    // Encontrar puerto disponible y iniciar servidor
    findAvailablePort(PORT).then(availablePort => {
        PORT = availablePort;
        server = expressApp.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
            // Actualizar la URL de carga si el puerto cambió
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.loadURL(`http://${config.server.host}:${PORT}`);
            }
        });
    }).catch(error => {
        console.error('Error al iniciar servidor:', error);
    });
}

// Crear la ventana principal de la aplicación
function createWindow() {
    mainWindow = new BrowserWindow({
        width: config.electron.width,
        height: config.electron.height,
        minWidth: config.electron.minWidth,
        minHeight: config.electron.minHeight,
        webPreferences: {
            ...config.electron.webPreferences,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: fs.existsSync(config.paths.icon) ? config.paths.icon : undefined,
        title: config.app.name,
        show: config.electron.show
    });

    // Cargar la aplicación
    mainWindow.loadURL(`http://${config.server.host}:${config.server.port}`);

    // Mostrar la ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Manejar el cierre de la ventana
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Abrir enlaces externos en el navegador
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Eventos de la aplicación
app.whenReady().then(() => {
    createServer();
    createWindow();
    try {
        createMenu(mainWindow);
    } catch (error) {
        console.log('No se pudo crear el menú, continuando sin menú personalizado');
    }
    
    try {
        createTray(mainWindow);
    } catch (error) {
        console.log('No se pudo crear el tray, continuando sin funcionalidad de bandeja');
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC handlers para comunicación con el renderer
ipcMain.handle('open-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Seleccionar carpeta de extracciones'
    });
    return result;
});

ipcMain.handle('show-file', async (event, filePath) => {
    if (fs.existsSync(filePath)) {
        shell.showItemInFolder(filePath);
        return { success: true };
    }
    return { success: false, error: 'Archivo no encontrado' };
});

// Limpiar al cerrar
app.on('before-quit', () => {
    if (server) {
        server.close();
    }
    if (client) {
        client.destroy();
    }
    destroyTray();
}); 