# 🛍️ JS Indumentaria - Sitio Web

Un sitio web moderno y responsive para mostrar el catálogo de productos de JS Indumentaria, con funcionalidades interactivas y diseño profesional.

## 📋 Índice

- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Instalación y Uso](#-instalación-y-uso)
- [Generación del Catálogo](#-generación-del-catálogo)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Responsive Design](#-responsive-design)
- [Accesibilidad](#-accesibilidad)

## ✨ Características

### 🎨 Diseño Moderno
- **Interfaz elegante** con tema oscuro y acentos dorados
- **Animaciones suaves** y transiciones profesionales
- **Tipografía moderna** con fuentes del sistema
- **Efectos visuales** como blur, sombras y gradientes

### 📱 Responsive Design
- **Adaptable a todos los dispositivos** (desktop, tablet, móvil)
- **Menú hamburguesa** para dispositivos móviles
- **Navegación táctil** optimizada
- **Imágenes adaptativas** que se ajustan al tamaño de pantalla

### 🛍️ Catálogo Interactivo
- **Filtros por categorías** (Remeras, Buzos, Pantalones, etc.)
- **Slideshow automático** de imágenes de productos
- **Indicadores visuales** para múltiples imágenes
- **Efectos hover** en las tarjetas de productos

### 🔍 Modal Avanzado
- **Vista a pantalla completa** de productos
- **Navegación de imágenes** con flechas
- **Información en hover** que aparece al pasar el mouse
- **Múltiples formas de cierre** (X, click en fondo, tecla Escape)
- **Fondo borroso** del contenido subyacente

### 💬 Integración Social
- **Botón flotante de WhatsApp** para consultas rápidas
- **Enlaces a Instagram** en el footer
- **Botón de compra** en el modal que abre WhatsApp

## 📁 Estructura del Proyecto

```
PaginaWeb/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── generarCatalogo.js      # Script para generar catálogo
├── catalogo.json           # Catálogo generado (se crea automáticamente)
├── logo.jpeg              # Logo de la empresa
├── Catalogo/              # Carpeta con productos
│   ├── remeras/
│   │   ├── remera1/
│   │   │   ├── info.txt
│   │   │   └── imagenes/
│   │   │       ├── remera10.jpg
│   │   │       ├── remera11.jpg
│   │   │       └── ...
│   │   └── remera2/
│   ├── buzos/
│   ├── pantalones/
│   └── ...
└── README.md              # Este archivo
```

## 🚀 Funcionalidades Principales

### 1. **Navegación**
- **Header fijo** con logo y menú de navegación
- **Scroll suave** entre secciones
- **Menú responsive** que se adapta a móviles
- **Navegación por teclado** para accesibilidad

### 2. **Optimización de Imágenes**
- **Lazy loading** inteligente con Intersection Observer
- **Formatos WebP** optimizados para mejor compresión
- **Imágenes responsivas** con diferentes tamaños
- **Placeholders animados** mientras cargan las imágenes

### 3. **Sección Hero**
- **Imagen de fondo optimizada** con overlay
- **Título llamativo** y descripción
- **Botón CTA** que lleva al catálogo
- **Diseño impactante** para primera impresión

### 4. **Catálogo de Productos**
- **Grid responsive** de productos
- **Filtros dinámicos** por categorías
- **Slideshow automático** de imágenes
- **Indicadores visuales** para múltiples fotos
- **Efectos hover** con escalado y sombras
- **Lazy loading** para mejor rendimiento

### 5. **Modal con Transiciones Suaves**
- **Vista a pantalla completa** de productos
- **Transiciones suaves** al cambiar imágenes (fade + escala)
- **Navegación múltiple**: flechas, gestos táctiles, teclado
- **Información en hover** que aparece al pasar el mouse
- **Múltiples formas de cierre** (X, click en fondo, tecla Escape)
- **Fondo borroso** del contenido subyacente

### 6. **Footer**
- **Información de contacto** con números de WhatsApp
- **Enlaces a redes sociales** (Instagram, Facebook, TikTok)
- **Botón destacado** de Instagram
- **Diseño profesional** con gradientes

## 💻 Instalación y Uso

### Requisitos Previos
- **Node.js** instalado en tu sistema (versión 14+)
- **Navegador web** moderno
- **Sharp** para optimización de imágenes (se instala automáticamente)

### Pasos de Instalación

1. **Clona o descarga** el proyecto
2. **Abre una terminal** en la carpeta del proyecto
3. **Instala las dependencias** (opcional, para optimización de imágenes):
   ```bash
   npm install
   ```
4. **Ejecuta el script** para generar el catálogo:
   ```bash
   node generarCatalogo.js
   ```
5. **Optimiza las imágenes** (opcional):
   ```bash
   npm run optimize-images
   ```
6. **Abre el archivo** `index.html` en tu navegador

### Para Desarrollo Local
```bash
# Navega a la carpeta del proyecto
cd PaginaWeb

# Genera el catálogo
node generarCatalogo.js

# Abre en el navegador (o usa un servidor local)
# Opción 1: Doble click en index.html
# Opción 2: Servidor local con Python
python -m http.server 8000
# Luego visita: http://localhost:8000
```

## 📦 Generación del Catálogo

### Cómo Funciona
El archivo `generarCatalogo.js` lee automáticamente la estructura de carpetas en `Catalogo/` y genera un archivo JSON con toda la información de los productos.

### Estructura de Datos
```json
[
  {
    "categoria": "remeras",
    "nombre": "Remera Básica",
    "precio": 15000,
    "descripcion": "Remera de algodón 100%",
    "imagenes": [
      "Catalogo/remeras/remera1/imagenes/remera10.jpg",
      "Catalogo/remeras/remera1/imagenes/remera11.jpg"
    ]
  }
]
```

### Formato de Archivos
- **info.txt**: Contiene nombre, precio y descripción del producto
- **imagenes/**: Carpeta con todas las fotos del producto
- **Ordenamiento**: Las imágenes se ordenan numéricamente (remera0, remera1, etc.)

## 📂 Estructura de Carpetas

### Organización de Productos
```
Catalogo/
├── [categoria]/
│   ├── [producto]/
│   │   ├── info.txt          # Información del producto
│   │   └── imagenes/
│   │       ├── [producto]0.jpg
│   │       ├── [producto]1.jpg
│   │       └── ...
│   └── [otro-producto]/
└── [otra-categoria]/
```

### Formato de info.txt
```
Nombre del Producto
15000
Descripción detallada del producto
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Funcionalidad interactiva
- **Flexbox** - Layout responsive
- **CSS Grid** - Organización de elementos

### Características CSS
- **Variables CSS** para consistencia de colores
- **Flexbox** para layouts flexibles
- **Transiciones** y animaciones suaves
- **Media queries** para responsive design
- **Backdrop-filter** para efectos de blur

### JavaScript
- **Fetch API** para cargar datos
- **DOM manipulation** dinámica
- **Event listeners** para interactividad
- **LocalStorage** (preparado para futuras funcionalidades)

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px
- **Tablet**: 768px - 1024px
- **Móvil**: < 768px

### Adaptaciones Móviles
- **Menú hamburguesa** que se desliza desde la derecha
- **Modal optimizado** con botones más grandes
- **Grid de productos** que se ajusta a 1-2 columnas
- **Texto redimensionado** para mejor legibilidad

### Características Táctiles
- **Botones más grandes** para interacción táctil
- **Espaciado aumentado** entre elementos
- **Gestos optimizados** para navegación

## ♿ Accesibilidad

### Características de Accesibilidad
- **Navegación por teclado** completa
- **ARIA labels** en elementos interactivos
- **Contraste adecuado** de colores
- **Focus management** en modales
- **Texto alternativo** en imágenes

### Navegación por Teclado
- **Tab**: Navegar entre elementos
- **Enter/Space**: Activar botones
- **Escape**: Cerrar modal
- **Flechas**: Navegar en el modal

### Lectores de Pantalla
- **Estructura semántica** con HTML5
- **Etiquetas descriptivas** en botones
- **Información contextual** en enlaces
- **Estados de elementos** claramente definidos

## 🎯 Funcionalidades Específicas

### Slideshow de Productos
- **Cambio automático** cada 2.5 segundos
- **Transiciones suaves** con fade y scale
- **Pausa en hover** para mejor experiencia
- **Indicadores visuales** que muestran la imagen actual

### Filtros de Categoría
- **Filtrado dinámico** sin recargar la página
- **Estado visual** del filtro activo
- **Animaciones suaves** en los cambios
- **Mensaje informativo** cuando no hay productos

### Modal Interactivo
- **Apertura suave** con animación
- **Navegación de imágenes** con flechas
- **Información en hover** que aparece centrada
- **Múltiples formas de cierre** para comodidad

### Integración WhatsApp
- **Botón flotante** siempre visible
- **Enlaces directos** con mensaje predefinido
- **Información del producto** incluida en el mensaje
- **Números de contacto** en el footer

## 🔧 Personalización

### Colores y Temas
Los colores se pueden modificar fácilmente en las variables CSS:
```css
:root {
  --bg-color: #1a1a1a;        /* Color de fondo */
  --accent-color: #FFD700;    /* Color de acento */
  --text-color-primary: #FFFFFF;    /* Texto principal */
  --text-color-secondary: #CCCCCC;  /* Texto secundario */
}
```

### Agregar Nuevos Productos
1. Crea una nueva carpeta en `Catalogo/[categoria]/[producto]`
2. Agrega un archivo `info.txt` con la información
3. Coloca las imágenes en la carpeta `imagenes/`
4. Ejecuta `node generarCatalogo.js`
5. ¡Listo! El producto aparecerá automáticamente

### Modificar Categorías
Para agregar o cambiar categorías, edita los botones en `index.html`:
```html
<button data-categoria="nueva-categoria">Nueva Categoría</button>
```

## 🚀 Despliegue

### Opciones de Hosting
- **Netlify** - Despliegue automático desde GitHub
- **Vercel** - Plataforma moderna para sitios estáticos
- **GitHub Pages** - Hosting gratuito para proyectos
- **Servidor tradicional** - Apache, Nginx, etc.

### Consideraciones de Despliegue
- **Generar el catálogo** antes del despliegue
- **Optimizar imágenes** para mejor rendimiento
- **Configurar cache** para `catalogo.json`
- **Verificar enlaces** y rutas relativas

## 📞 Soporte y Contacto

### Información de Contacto
- **WhatsApp**: +54 11 7058-3125 / +54 11 2400-3793
- **Instagram**: @js_indumentaria_
- **Email**: [Agregar email si está disponible]

### Reportar Problemas
Si encuentras algún problema o tienes sugerencias:
1. Revisa que todos los archivos estén en su lugar
2. Verifica que el catálogo se haya generado correctamente
3. Comprueba que las imágenes estén en las rutas correctas
4. Contacta a través de WhatsApp o Instagram

---

**Desarrollado con ❤️ para JS Indumentaria**

*Este sitio web está diseñado para ofrecer una experiencia de compra moderna y profesional, facilitando la visualización de productos y el contacto directo con la empresa.* 