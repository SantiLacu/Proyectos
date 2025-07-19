// menu.js
// Menú de la aplicación WhatsApp To Excel

const { Menu, shell, app } = require('electron');
const config = require('./config');

function createMenu(mainWindow) {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Nueva extracción',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.send('new-extraction');
                    }
                },
                {
                    label: 'Abrir carpeta de extracciones',
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        const result = await mainWindow.webContents.executeJavaScript(`
                            window.electronAPI.openFolder();
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Salir',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectall' }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'WhatsApp',
            submenu: [
                {
                    label: 'Reconectar',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow.webContents.send('reconnect-whatsapp');
                    }
                },
                {
                    label: 'Regenerar QR',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: () => {
                        mainWindow.webContents.send('regenerate-qr');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Estado de conexión',
                    enabled: false,
                    id: 'connection-status'
                }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Acerca de',
                    click: () => {
                        shell.openExternal('https://github.com/tu-usuario/App_WhatsappToExcel');
                    }
                },
                {
                    label: 'Documentación',
                    click: () => {
                        shell.openExternal('https://github.com/tu-usuario/App_WhatsappToExcel#readme');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Reportar problema',
                    click: () => {
                        shell.openExternal('https://github.com/tu-usuario/App_WhatsappToExcel/issues');
                    }
                }
            ]
        }
    ];

    // Agregar menú específico para macOS
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
}

module.exports = { createMenu }; 