// config.js
// Configuración de la aplicación WhatsApp To Excel

const path = require('path');

const config = {
    // Configuración de la aplicación
    app: {
        name: 'WhatsApp To Excel',
        version: '1.0.0',
        description: 'App de escritorio para extraer mensajes de WhatsApp y exportar a Excel'
    },

    // Configuración del servidor
    server: {
        port: process.env.PORT || 3000,
        host: 'localhost'
    },

    // Configuración de WhatsApp Web
    whatsapp: {
        headless: true,
        timeout: 30000,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },

    // Configuración de Electron
    electron: {
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        }
    },

    // Rutas de archivos
    paths: {
        extracciones: path.join(__dirname, 'extracciones'),
        public: path.join(__dirname, 'public'),
        icon: path.join(__dirname, 'public', 'icon.svg')
    },

    // Configuración de desarrollo
    development: {
        devTools: process.env.NODE_ENV === 'development',
        reloadOnChange: true
    }
};

module.exports = config; 