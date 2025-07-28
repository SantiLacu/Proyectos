// generarCatalogo.js
const fs = require('fs');
const path = require('path');

// Función para normalizar texto (manejar caracteres especiales)
function normalizarTexto(texto) {
  if (!texto) return '';
  
  // Normalizar caracteres especiales
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim();
}

// Función para validar y parsear precio
function parsearPrecio(precioStr) {
  if (!precioStr) return 0;
  
  // Remover caracteres no numéricos excepto punto y coma
  const precioLimpio = precioStr.toString().replace(/[^\d.,]/g, '');
  
  // Convertir a número
  let precio = parseFloat(precioLimpio.replace(',', '.'));
  
  // Validar que sea un número válido
  if (isNaN(precio) || precio < 0) {
    console.warn(`⚠️  Precio inválido: "${precioStr}". Usando 0 como valor por defecto.`);
    return 0;
  }
  
  return Math.round(precio); // Redondear a entero
}

// Función para leer y validar info.txt
function leerInfoProducto(rutaProducto) {
  const infoPath = path.join(rutaProducto, 'info.txt');
  
  if (!fs.existsSync(infoPath)) {
    console.warn(`⚠️  No se encontró info.txt en: ${rutaProducto}`);
    return null;
  }
  
  try {
    const contenido = fs.readFileSync(infoPath, 'utf8');
    const lineas = contenido.split('\n').map(linea => linea.trim()).filter(linea => linea);
    
    // Validar que tenga al menos 3 líneas
    if (lineas.length < 3) {
      console.warn(`⚠️  info.txt incompleto en: ${rutaProducto}. Se requieren al menos 3 líneas.`);
      return null;
    }
    
    const [nombre, precioStr, ...descripcionPartes] = lineas;
    
    // Validar nombre
    if (!nombre || nombre.length < 2) {
      console.warn(`⚠️  Nombre inválido en: ${rutaProducto}`);
      return null;
    }
    
    // Parsear precio
    const precio = parsearPrecio(precioStr);
    
    // Construir descripción
    const descripcion = descripcionPartes.join(' ').trim();
    if (!descripcion || descripcion.length < 5) {
      console.warn(`⚠️  Descripción muy corta en: ${rutaProducto}`);
      return null;
    }
    
    return {
      nombre: nombre.trim(),
      precio: precio,
      descripcion: descripcion
    };
    
  } catch (error) {
    console.error(`❌ Error leyendo info.txt en ${rutaProducto}:`, error.message);
    return null;
  }
}

// Función para obtener imágenes de un producto
function obtenerImagenesProducto(rutaProducto) {
  const imagenesPath = path.join(rutaProducto, 'imagenes');
  
  if (!fs.existsSync(imagenesPath)) {
    console.warn(`⚠️  No se encontró carpeta imagenes en: ${rutaProducto}`);
    return [];
  }
  
  try {
    const archivos = fs.readdirSync(imagenesPath);
    const imagenes = archivos
      .filter(archivo => {
        const ext = path.extname(archivo).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'].includes(ext);
      })
      .map(archivo => {
        const ext = path.extname(archivo).toLowerCase();
        const rutaCompleta = path.join('Catalogo', path.relative('Catalogo', rutaProducto), 'imagenes', archivo);
        
        // Advertencia para archivos HEIC
        if (ext === '.heic' || ext === '.heif') {
          console.warn(`⚠️  Archivo HEIC detectado: ${archivo}. Considera convertir a WebP para mejor compatibilidad.`);
        }
        
        return rutaCompleta;
      })
      .sort(); // Ordenar alfabéticamente
    
    return imagenes;
    
  } catch (error) {
    console.error(`❌ Error leyendo imágenes en ${rutaProducto}:`, error.message);
    return [];
  }
}

// Función principal para generar catálogo
function generarCatalogo() {
  console.log('🔄 Generando catálogo...');
  
  const catalogoPath = 'Catalogo';
  const productos = [];
  const categoriasEncontradas = new Set();
  
  if (!fs.existsSync(catalogoPath)) {
    console.error('❌ No se encontró la carpeta Catalogo/');
    return;
  }
  
  try {
    // Leer categorías
    const categorias = fs.readdirSync(catalogoPath).filter(item => {
      const rutaCompleta = path.join(catalogoPath, item);
      return fs.statSync(rutaCompleta).isDirectory();
    });
    
    console.log(`📁 Categorías encontradas: ${categorias.join(', ')}`);
    
    // Procesar cada categoría
    categorias.forEach(categoria => {
      const rutaCategoria = path.join(catalogoPath, categoria);
      const productosCategoria = fs.readdirSync(rutaCategoria).filter(item => {
        const rutaCompleta = path.join(rutaCategoria, item);
        return fs.statSync(rutaCompleta).isDirectory();
      });
      
      console.log(`\n📦 Procesando categoría: ${categoria} (${productosCategoria.length} productos)`);
      
      // Procesar cada producto
      productosCategoria.forEach(producto => {
        const rutaProducto = path.join(rutaCategoria, producto);
        
        // Leer información del producto
        const info = leerInfoProducto(rutaProducto);
        if (!info) {
          console.warn(`⚠️  Saltando producto inválido: ${producto}`);
          return;
        }
        
        // Obtener imágenes
        const imagenes = obtenerImagenesProducto(rutaProducto);
        if (imagenes.length === 0) {
          console.warn(`⚠️  Producto sin imágenes: ${producto}`);
          return;
        }
        
        // Crear objeto del producto
        const productoObj = {
          categoria: categoria,
          nombre: info.nombre,
          precio: info.precio,
          descripcion: info.descripcion,
          imagenes: imagenes
        };
        
        productos.push(productoObj);
        categoriasEncontradas.add(categoria);
        
        console.log(`✅ ${info.nombre} - $${info.precio.toLocaleString()}`);
      });
    });
    
    // Guardar catálogo
    const catalogoJSON = JSON.stringify(productos, null, 2);
    fs.writeFileSync('catalogo.json', catalogoJSON, 'utf8');
    
    // Generar reporte
    console.log('\n📊 REPORTE FINAL:');
    console.log(`📦 Total de productos: ${productos.length}`);
    console.log(`📁 Categorías con productos: ${categoriasEncontradas.size}`);
    console.log(`💰 Rango de precios: $${Math.min(...productos.map(p => p.precio)).toLocaleString()} - $${Math.max(...productos.map(p => p.precio)).toLocaleString()}`);
    console.log(`🖼️  Total de imágenes: ${productos.reduce((total, p) => total + p.imagenes.length, 0)}`);
    
    // Mostrar categorías encontradas
    console.log('\n📁 Categorías con productos:');
    categoriasEncontradas.forEach(cat => {
      const count = productos.filter(p => p.categoria === cat).length;
      console.log(`  • ${cat}: ${count} productos`);
    });
    
    console.log('\n✅ Catálogo generado exitosamente en catalogo.json');
    
  } catch (error) {
    console.error('❌ Error generando catálogo:', error.message);
  }
}

// Ejecutar si es el script principal
if (require.main === module) {
  generarCatalogo();
}

module.exports = { generarCatalogo };