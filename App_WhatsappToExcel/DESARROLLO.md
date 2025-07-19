# Guía de Desarrollo - WhatsApp To Excel

## 🏗️ Arquitectura de la Aplicación

La aplicación está construida con **Electron** y utiliza una arquitectura cliente-servidor integrada:

### Estructura de Archivos

```
App_WhatsappToExcel/
├── main.js              # Proceso principal de Electron
├── preload.js           # Script de precarga (APIs seguras)
├── menu.js              # Menú de la aplicación
├── tray.js              # Funcionalidad de bandeja del sistema
├── config.js            # Configuración centralizada
├── server.js            # Servidor Express (legacy)
├── package.json         # Dependencias y scripts
├── public/              # Frontend (HTML, CSS, JS)
│   ├── index.html       # Interfaz principal
│   ├── app.js          # Lógica del frontend
│   ├── style.css       # Estilos
│   └── icon.svg        # Icono SVG
└── extracciones/        # Archivos extraídos
```

### Flujo de Datos

1. **main.js** inicia el proceso principal de Electron
2. Se crea el servidor Express interno
3. Se inicializa WhatsApp Web.js
4. Se crea la ventana principal y se carga el frontend
5. El frontend se comunica con el backend vía HTTP
6. Las APIs nativas se exponen vía preload.js

## 🔧 Configuración

### Variables de Entorno

```bash
NODE_ENV=development    # Modo de desarrollo
PORT=3000              # Puerto del servidor
ELECTRON_IS_DEV=true   # Habilita DevTools
```

### Archivo de Configuración

El archivo `config.js` centraliza toda la configuración:

```javascript
const config = {
    app: {
        name: 'WhatsApp To Excel',
        version: '1.0.0'
    },
    server: {
        port: 3000,
        host: 'localhost'
    },
    whatsapp: {
        headless: true,
        timeout: 30000
    },
    electron: {
        width: 1200,
        height: 800
    }
};
```

## 🚀 Scripts de Desarrollo

### Comandos Disponibles

```bash
npm start          # Inicia la aplicación
npm run dev        # Modo desarrollo con flags
npm run watch      # Recarga automática con nodemon
npm run build      # Construye para distribución
npm run build:win  # Construye solo para Windows
npm run server     # Ejecuta solo el servidor (legacy)
```

### Desarrollo con Recarga Automática

```bash
npm run watch
```

Esto ejecuta la aplicación con nodemon, que recarga automáticamente cuando detecta cambios en:
- `main.js`
- `preload.js`
- `server.js`
- Archivos en `public/`

## 🔌 APIs y Comunicación

### APIs del Frontend

El frontend puede acceder a APIs nativas a través de `window.electronAPI`:

```javascript
// Abrir carpeta
await window.electronAPI.openFolder();

// Mostrar archivo
await window.electronAPI.showFile(filePath);

// Eventos de WhatsApp
window.electronAPI.onWhatsAppReady(callback);
window.electronAPI.onWhatsAppDisconnected(callback);
window.electronAPI.onQrUpdated(callback);
window.electronAPI.onExtractionComplete(callback);
```

### Eventos del Menú

El menú puede enviar eventos al frontend:

```javascript
// En main.js
mainWindow.webContents.send('new-extraction');
mainWindow.webContents.send('reconnect-whatsapp');
mainWindow.webContents.send('regenerate-qr');
```

## 🎨 Interfaz de Usuario

### Estructura CSS

La aplicación usa un diseño modular con CSS:

- **Colores principales**: Verde WhatsApp (#25d366)
- **Tema oscuro**: Fondo #181a20, elementos #23272f
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves para mejor UX

### Componentes Principales

1. **Pantalla de QR**: Modal para autenticación
2. **Barra lateral izquierda**: Lista de contactos con búsqueda
3. **Barra lateral derecha**: Contactos seleccionados
4. **Área central**: Acciones principales y estado
5. **Notificaciones**: Sistema de feedback visual

## 🔒 Seguridad

### Context Isolation

La aplicación utiliza `contextIsolation: true` para seguridad:

- El frontend no tiene acceso directo a Node.js
- Las APIs se exponen de forma controlada
- No hay `nodeIntegration` habilitada

### Validación de Datos

```javascript
// Ejemplo de validación en el backend
if (!isReady) {
    return res.status(503).json({ error: 'WhatsApp no está listo' });
}
```

## 🐛 Debugging

### Herramientas de Desarrollo

1. **DevTools**: `Ctrl+Shift+I` (Windows/Linux) o `Cmd+Option+I` (macOS)
2. **Console**: Logs del proceso principal y renderer
3. **Network**: Monitoreo de peticiones HTTP
4. **Elements**: Inspección del DOM

### Logs

```javascript
// En main.js
console.log('WhatsApp Web listo');
console.log('Cantidad de contactos:', contacts.length);

// En el frontend
console.log('Contactos cargados:', contacts);
```

## 📦 Construcción

### Configuración de Build

El archivo `electron-builder.json` configura la construcción:

```json
{
  "appId": "com.whatsapptoexcel.app",
  "productName": "WhatsApp To Excel",
  "files": ["main.js", "preload.js", "public/**/*"],
  "win": {
    "target": "nsis",
    "icon": "public/icon.ico"
  }
}
```

### Proceso de Build

1. **Empaquetado**: Los archivos se empaquetan en un archivo ASAR
2. **Compresión**: Máxima compresión para reducir tamaño
3. **Instalador**: Generación de instalador nativo
4. **Distribución**: Archivos en carpeta `dist/`

## 🔄 Actualizaciones

### Sistema de Actualizaciones

La aplicación está preparada para actualizaciones automáticas:

1. **AutoUpdater**: Integrado en el build
2. **Verificación**: Checksums de seguridad
3. **Rollback**: Reversión automática si falla

### Versionado

Sigue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambios incompatibles
- **MINOR**: Nuevas funcionalidades
- **PATCH**: Correcciones de bugs

## 🤝 Contribución

### Estándares de Código

1. **ESLint**: Configuración en `.eslintrc.js`
2. **Prettier**: Formateo automático
3. **Commits**: Mensajes descriptivos
4. **Tests**: Cobertura mínima del 80%

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Desarrollar y testear
4. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
5. Push y Pull Request

## 📚 Recursos

### Documentación

- [Electron Documentation](https://www.electronjs.org/docs)
- [WhatsApp Web.js](https://docs.wwebjs.dev/)
- [Express.js](https://expressjs.com/)

### Herramientas

- **Electron**: Framework de aplicaciones de escritorio
- **WhatsApp Web.js**: Cliente de WhatsApp Web
- **Express**: Servidor web
- **Electron Builder**: Construcción de distributibles

---

**¡Feliz desarrollo! 🚀** 