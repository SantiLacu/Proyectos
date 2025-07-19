// server.js
// Backend principal para la app WhatsAppToExcel
// - Maneja la conexión con WhatsApp Web usando whatsapp-web.js
// - Expone endpoints para el frontend

const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode'); // Para generar QR como imagen base64
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const qrcodeTerminal = require('qrcode-terminal'); // Agrega la librería para mostrar el QR

const app = express();
const PORT = 3000;

// Permite peticiones desde el frontend
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializa el cliente de WhatsApp Web y guarda la sesión localmente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

let contacts = [];
let lastQr = null;
let isReady = false;
let qrTimeout = null;

// Evento: QR para iniciar sesión
client.on('qr', async (qr) => {
    lastQr = await qrcode.toDataURL(qr);
    isReady = false;
    console.log('QR generado, esperando conexión...');
});

// Evento: WhatsApp listo
client.on('ready', async () => {
    isReady = true;
    lastQr = null;
    contacts = await client.getContacts();
    console.log('WhatsApp Web listo');
    console.log('Cantidad de contactos obtenidos:', contacts.length);
    if (contacts.length > 0) {
        console.log('Ejemplo de contacto:', contacts[0]);
    }
});

client.on('disconnected', (reason) => {
    isReady = false;
    lastQr = null;
    console.log('Desconectado de WhatsApp Web:', reason);
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
app.get('/api/contacts', (req, res) => {
    if (!isReady) return res.status(503).json({ error: 'WhatsApp no está listo' });
    // Devuelve solo nombre y número
    const simpleContacts = contacts.map(c => ({
        id: c.id._serialized,
        name: c.name || c.pushname || c.number
    }));
    res.json(simpleContacts);
});

// Endpoint: extraer mensajes de un contacto
app.post('/api/extract', async (req, res) => {
    const { contactId } = req.body;
    if (!isReady) return res.status(503).json({ error: 'WhatsApp no está listo' });
    try {
        const chat = await client.getChatById(contactId);
        // Forzar recarga de los últimos 5 mensajes recientes
        const messages = await chat.fetchMessages({ limit: 5, force: true });
        console.log('Mensajes RAW obtenidos:', messages.map(m => ({ type: m.type, body: m.body, from: m.from, author: m.author, timestamp: m.timestamp })));
        const textMessages = messages.filter(m => m.type === 'chat' && m.body && m.body.trim() !== '').map(m => `${m.timestamp} - ${m.author || m.from}: ${m.body}`);
        console.log('Mensajes filtrados para guardar:', textMessages);
        // Carpeta de salida
        const contactName = getSafeName(chat.name || chat.id.user || chat.id._serialized);
        const now = new Date();
        const fecha = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
        const outDir = path.resolve(__dirname, 'extracciones');
        const contactDir = path.resolve(outDir, contactName);
        fs.mkdirSync(contactDir, { recursive: true });
        const filePath = path.join(contactDir, `mensajes_${contactName}_${fecha}.txt`);
        fs.writeFileSync(filePath, textMessages.join('\n'));
        console.log(`Archivo guardado en: ${filePath}`);
        res.json({ success: true, file: filePath });
    } catch (err) {
        console.error('Error al guardar la extracción:', err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para obtener el QR actual
app.get('/api/qr', (req, res) => {
    if (lastQr) {
        res.json({ qr: lastQr });
    } else {
        res.status(404).json({ error: 'No hay QR disponible' });
    }
});

// Endpoint para saber si está conectado
app.get('/api/status', (req, res) => {
    res.json({ connected: isReady });
});

// Endpoint para regenerar QR (reinicia el cliente)
app.post('/api/regen-qr', (req, res) => {
    isReady = false;
    lastQr = null;
    client.destroy();
    setTimeout(() => client.initialize(), 1000);
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
