# WhatsApp To Excel - Aplicación de Escritorio

Una aplicación de escritorio desarrollada con Electron para extraer mensajes de WhatsApp y exportarlos a archivos de texto organizados.

## 🚀 Características

- **Interfaz de escritorio nativa**: Aplicación de escritorio completa con Electron
- **Conexión WhatsApp Web**: Integración directa con WhatsApp Web mediante QR
- **Gestión de contactos**: Lista completa de contactos con búsqueda en tiempo real
- **Extracción de mensajes**: Extrae los últimos mensajes de conversaciones seleccionadas
- **Organización automática**: Los archivos se organizan por contacto y fecha
- **Notificaciones en tiempo real**: Feedback visual del estado de las operaciones
- **Interfaz moderna**: Diseño oscuro con colores de WhatsApp

## 📋 Requisitos

- Node.js 16 o superior
- npm o yarn
- Conexión a internet para WhatsApp Web

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd App_WhatsappToExcel
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta la aplicación en modo desarrollo:**
   ```bash
   npm run dev
   ```

## 🚀 Uso

### Inicio de la aplicación

1. Ejecuta `npm start` para iniciar la aplicación
2. La aplicación se abrirá en una ventana de escritorio
3. Escanea el código QR que aparece con tu WhatsApp móvil
4. Una vez conectado, verás tu lista de contactos

### Extracción de mensajes

1. **Selecciona contactos**: Busca y selecciona los contactos de los que quieres extraer mensajes
2. **Extrae mensajes**: Haz clic en "Extraer mensajes" para procesar los contactos seleccionados
3. **Revisa los archivos**: Los archivos se guardan en la carpeta `extracciones/` organizados por contacto

### Funcionalidades adicionales

- **Abrir carpeta de extracciones**: Acceso directo a la carpeta donde se guardan los archivos
- **Búsqueda de contactos**: Filtra contactos por nombre en tiempo real
- **Regenerar QR**: Si el QR expira, puedes generar uno nuevo

## 📁 Estructura del proyecto

```
App_WhatsappToExcel/
├── main.js                 # Proceso principal de Electron
├── preload.js             # Script de precarga para APIs seguras
├── server.js              # Servidor Express (legacy)
├── package.json           # Configuración del proyecto
├── public/                # Archivos del frontend
│   ├── index.html         # Página principal
│   ├── app.js            # Lógica del frontend
│   ├── style.css         # Estilos de la aplicación
│   └── icon.png          # Icono de la aplicación
├── extracciones/          # Carpeta de archivos extraídos
│   └── [Contacto]/        # Subcarpetas por contacto
└── README.md             # Este archivo
```

## 🔧 Scripts disponibles

- `npm start`: Inicia la aplicación de escritorio
- `npm run dev`: Inicia en modo desarrollo con flags adicionales
- `npm run build`: Construye la aplicación para distribución
- `npm run server`: Ejecuta solo el servidor (modo web legacy)

## 📦 Construcción para distribución

Para crear un ejecutable de la aplicación:

```bash
npm run build
```

Esto generará archivos ejecutables en la carpeta `dist/` para:
- Windows (.exe)
- macOS (.dmg)
- Linux (.AppImage)

## 🔒 Seguridad

- La aplicación utiliza `contextIsolation` para seguridad
- Las APIs nativas se exponen de forma segura a través del preload script
- No se almacenan credenciales de WhatsApp en texto plano

## 🐛 Solución de problemas

### QR no aparece
- Verifica tu conexión a internet
- Intenta regenerar el QR
- Asegúrate de que WhatsApp móvil esté actualizado

### Error de conexión
- Cierra y vuelve a abrir la aplicación
- Verifica que no haya otra instancia de WhatsApp Web abierta
- Reinicia tu dispositivo móvil si es necesario

### Contactos no cargan
- Espera a que la conexión con WhatsApp se establezca completamente
- Verifica que tengas contactos en tu WhatsApp
- Intenta reconectar escaneando el QR nuevamente

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## ⚠️ Aviso legal

Esta aplicación es para uso personal y educativo. Respeta los términos de servicio de WhatsApp y las leyes de privacidad de tu jurisdicción. El desarrollador no se hace responsable del uso indebido de esta herramienta.

## 🆘 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa la sección de solución de problemas
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

**Desarrollado con ❤️ usando Electron y WhatsApp Web.js** 