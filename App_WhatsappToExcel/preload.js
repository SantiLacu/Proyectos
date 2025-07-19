const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Abrir carpeta de extracciones
    openFolder: () => ipcRenderer.invoke('open-folder'),
    
    // Mostrar archivo en el explorador
    showFile: (filePath) => ipcRenderer.invoke('show-file', filePath),
    
    // Eventos de WhatsApp
    onWhatsAppReady: (callback) => ipcRenderer.on('whatsapp-ready', callback),
    onWhatsAppDisconnected: (callback) => ipcRenderer.on('whatsapp-disconnected', callback),
    onQrUpdated: (callback) => ipcRenderer.on('qr-updated', callback),
    onExtractionComplete: (callback) => ipcRenderer.on('extraction-complete', callback),
    
    // Remover listeners
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 