// tray.js
// Funcionalidad de bandeja del sistema para WhatsApp To Excel

const { Tray, Menu, app, shell } = require('electron');
const path = require('path');
const config = require('./config');

let tray = null;

function createTray(mainWindow) {
    // Por ahora, deshabilitar el tray para evitar problemas con iconos
    console.log('Tray deshabilitado temporalmente para evitar problemas con iconos');
    return null;
    
    // Código original comentado para referencia futura
    /*
    let iconPath;
    try {
        iconPath = path.join(__dirname, 'public', 'icon.svg');
        if (!fs.existsSync(iconPath)) {
            iconPath = path.join(process.env.SYSTEMROOT, 'System32', 'shell32.dll');
        }
    } catch (error) {
        console.log('Error al cargar icono, usando icono por defecto del sistema');
        iconPath = path.join(process.env.SYSTEMROOT, 'System32', 'shell32.dll');
    }
    
    try {
        tray = new Tray(iconPath);
        tray.setToolTip(config.app.name);
    } catch (error) {
        console.log('Error al crear tray, deshabilitando funcionalidad de bandeja:', error.message);
        return null;
    }
    */

    // Crear el menú contextual
    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Mostrar ${config.app.name}`,
            click: () => {
                mainWindow.show();
                mainWindow.focus();
            }
        },
        {
            label: 'Nueva extracción',
            click: () => {
                mainWindow.show();
                mainWindow.focus();
                mainWindow.webContents.send('new-extraction');
            }
        },
        {
            label: 'Abrir carpeta de extracciones',
            click: async () => {
                const result = await mainWindow.webContents.executeJavaScript(`
                    window.electronAPI.openFolder();
                `);
            }
        },
        { type: 'separator' },
        {
            label: 'Reconectar WhatsApp',
            click: () => {
                mainWindow.webContents.send('reconnect-whatsapp');
            }
        },
        {
            label: 'Regenerar QR',
            click: () => {
                mainWindow.webContents.send('regenerate-qr');
            }
        },
        { type: 'separator' },
        {
            label: 'Acerca de',
            click: () => {
                shell.openExternal('https://github.com/tu-usuario/App_WhatsappToExcel');
            }
        },
        { type: 'separator' },
        {
            label: 'Salir',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    // Evento de clic en el ícono de la bandeja
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    // Evento de doble clic en el ícono de la bandeja
    tray.on('double-click', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    return tray;
}

function updateTrayIcon(status) {
    if (tray) {
        // Aquí podrías cambiar el ícono basado en el estado
        // Por ejemplo, verde para conectado, rojo para desconectado
        const iconPath = path.join(__dirname, 'public', 'icon.png');
        tray.setImage(iconPath);
        
        // Actualizar el tooltip
        const statusText = status.connected ? 'Conectado' : 'Desconectado';
        tray.setToolTip(`${config.app.name} - ${statusText}`);
    }
}

function destroyTray() {
    if (tray) {
        tray.destroy();
        tray = null;
    }
}

module.exports = { createTray, updateTrayIcon, destroyTray }; 