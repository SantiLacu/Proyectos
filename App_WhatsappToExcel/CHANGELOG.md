# Changelog - WhatsApp To Excel

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-XX

### 🚀 Agregado
- **Transformación completa a aplicación de escritorio** usando Electron
- **Interfaz nativa de escritorio** con ventana principal y menús
- **Sistema de menú completo** con atajos de teclado
- **Funcionalidad de bandeja del sistema** (tray) con menú contextual
- **Configuración centralizada** en archivo `config.js`
- **APIs nativas seguras** expuestas a través de preload script
- **Sistema de notificaciones mejorado** con tipos (success, error, warning, info)
- **Interfaz de usuario modernizada** con diseño responsive
- **Scripts de desarrollo mejorados** con nodemon para recarga automática
- **Configuración de build** para distribución multiplataforma
- **Documentación completa** con README y guía de desarrollo

### 🔧 Cambiado
- **Arquitectura**: De aplicación web a aplicación de escritorio
- **Interfaz**: Rediseño completo con tema oscuro y colores de WhatsApp
- **Comunicación**: APIs nativas en lugar de solo HTTP
- **Gestión de archivos**: Acceso directo al sistema de archivos
- **Experiencia de usuario**: Interfaz más intuitiva y profesional

### 🛠️ Técnico
- **Electron**: Framework principal para la aplicación de escritorio
- **Context Isolation**: Seguridad mejorada entre procesos
- **Preload Script**: APIs seguras para el renderer process
- **Configuración modular**: Separación de configuraciones por funcionalidad
- **Build system**: Electron Builder para distribución
- **Development tools**: Nodemon para desarrollo con recarga automática

### 📁 Archivos Nuevos
- `main.js` - Proceso principal de Electron
- `preload.js` - Script de precarga para APIs seguras
- `menu.js` - Sistema de menú de la aplicación
- `tray.js` - Funcionalidad de bandeja del sistema
- `config.js` - Configuración centralizada
- `nodemon.json` - Configuración para desarrollo
- `electron-builder.json` - Configuración de build
- `.electron-builder.yml` - Configuración alternativa de build
- `DESARROLLO.md` - Guía de desarrollo
- `CHANGELOG.md` - Este archivo
- `public/icon.svg` - Icono SVG de la aplicación

### 📁 Archivos Modificados
- `package.json` - Dependencias y scripts actualizados
- `public/app.js` - Integración con APIs nativas de Electron
- `public/style.css` - Diseño modernizado y responsive
- `README.md` - Documentación completa actualizada

### 🔒 Seguridad
- **Context Isolation**: Habilitado por defecto
- **Node Integration**: Deshabilitado por seguridad
- **APIs controladas**: Solo las necesarias expuestas al frontend
- **Validación**: Mejorada en todos los endpoints

### 🎨 UI/UX
- **Tema oscuro**: Diseño moderno con colores de WhatsApp
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves para mejor experiencia
- **Notificaciones**: Sistema visual mejorado con tipos
- **Iconografía**: Iconos SVG personalizados

### 📦 Distribución
- **Windows**: Instalador NSIS (.exe)
- **macOS**: DMG con instalación drag & drop
- **Linux**: AppImage portable
- **Auto-updater**: Preparado para actualizaciones automáticas

## [1.0.0] - 2025-01-XX

### 🚀 Agregado
- **Aplicación web inicial** con Express.js
- **Integración con WhatsApp Web** usando whatsapp-web.js
- **Sistema de autenticación QR**
- **Gestión de contactos** con búsqueda
- **Extracción de mensajes** a archivos de texto
- **Interfaz web básica** con barras laterales
- **Organización automática** de archivos por contacto

### 📁 Archivos Originales
- `server.js` - Servidor Express
- `public/index.html` - Interfaz web
- `public/app.js` - Lógica del frontend
- `public/style.css` - Estilos básicos
- `package.json` - Dependencias iniciales

---

## Notas de Versión

### Migración de 1.0.0 a 2.0.0

La versión 2.0.0 representa una transformación completa de la aplicación web a una aplicación de escritorio nativa. Los principales cambios incluyen:

1. **Nueva arquitectura**: Electron en lugar de solo Express
2. **Interfaz nativa**: Ventana de escritorio con menús
3. **Funcionalidades avanzadas**: Tray, atajos de teclado, APIs nativas
4. **Mejor experiencia**: Diseño moderno y responsive
5. **Distribución**: Ejecutables nativos para cada plataforma

### Compatibilidad

- **Backward compatibility**: Los archivos extraídos mantienen el mismo formato
- **Configuración**: Las configuraciones de WhatsApp Web se mantienen
- **Datos**: La carpeta `extracciones/` se preserva durante la migración

### Próximas Versiones

- **2.1.0**: Exportación a Excel real (no solo texto)
- **2.2.0**: Filtros avanzados de mensajes
- **2.3.0**: Sincronización en la nube
- **3.0.0**: Soporte para múltiples cuentas de WhatsApp 