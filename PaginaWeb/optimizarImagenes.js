// optimizarImagenes.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CATALOGO_DIR = path.join(__dirname, 'Catalogo');
const OUTPUT_DIR = path.join(__dirname, 'CatalogoOptimizado');

// Configuración de optimización
const CONFIG_OPTIMIZACION = {
  webp: {
    quality: 80,
    effort: 6
  },
  jpeg: {
    quality: 85,
    progressive: true
  },
  sizes: {
    thumbnail: 400,
    medium: 800,
    large: 1200
  }
};

// Función para crear directorio si no existe
function crearDirectorioSiNoExiste(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Función para optimizar una imagen
async function optimizarImagen(inputPath, outputPath, options = {}) {
  try {
    const {
      width = null,
      height = null,
      format = 'webp',
      quality = CONFIG_OPTIMIZACION.webp.quality
    } = options;

    let pipeline = sharp(inputPath);

    // Redimensionar si se especifica
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Aplicar optimizaciones según el formato
    if (format === 'webp') {
      pipeline = pipeline.webp({
        quality: quality,
        effort: CONFIG_OPTIMIZACION.webp.effort
      });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({
        quality: quality,
        progressive: CONFIG_OPTIMIZACION.jpeg.progressive
      });
    }

    await pipeline.toFile(outputPath);
    console.log(`✅ Optimizada: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    
    // Mostrar información de compresión
    const originalStats = fs.statSync(inputPath);
    const optimizedStats = fs.statSync(outputPath);
    const compressionRatio = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
    
    console.log(`📊 Compresión: ${originalStats.size} -> ${optimizedStats.size} bytes (${compressionRatio}% reducción)`);
    
  } catch (error) {
    console.error(`❌ Error optimizando ${inputPath}:`, error.message);
  }
}

// Función para procesar todas las imágenes de un directorio
async function procesarDirectorio(dirPath, outputDir) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Crear directorio correspondiente en output
      const newOutputDir = path.join(outputDir, item);
      crearDirectorioSiNoExiste(newOutputDir);
      
      // Procesar subdirectorio
      await procesarDirectorio(itemPath, newOutputDir);
    } else if (stats.isFile()) {
      // Verificar si es una imagen
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.heic', '.heif'].includes(ext)) {
        const fileName = path.basename(item, ext);
        const outputPath = path.join(outputDir, `${fileName}.webp`);
        
        // Optimizar imagen
        await optimizarImagen(itemPath, outputPath, {
          width: CONFIG_OPTIMIZACION.sizes.medium,
          format: 'webp',
          quality: CONFIG_OPTIMIZACION.webp.quality
        });
      }
    }
  }
}

// Función para generar múltiples tamaños de una imagen
async function generarTamanosMultiples(inputPath, outputDir, fileName) {
  const sizes = CONFIG_OPTIMIZACION.sizes;
  
  for (const [sizeName, width] of Object.entries(sizes)) {
    const outputPath = path.join(outputDir, `${fileName}-${sizeName}.webp`);
    await optimizarImagen(inputPath, outputPath, {
      width: width,
      format: 'webp'
    });
  }
}

// Función principal
async function optimizarCatalogo() {
  console.log('🚀 Iniciando optimización del catálogo...');
  
  if (!fs.existsSync(CATALOGO_DIR)) {
    console.error('❌ No se encontró el directorio Catalogo/');
    return;
  }
  
  // Crear directorio de salida
  crearDirectorioSiNoExiste(OUTPUT_DIR);
  
  // Procesar todo el catálogo
  await procesarDirectorio(CATALOGO_DIR, OUTPUT_DIR);
  
  console.log('\n✅ Optimización completada!');
  console.log(`📁 Imágenes optimizadas en: ${OUTPUT_DIR}`);
  console.log('\n📋 Próximos pasos:');
  console.log('1. Revisar las imágenes optimizadas');
  console.log('2. Actualizar las rutas en catalogo.json');
  console.log('3. Reemplazar las imágenes originales si es necesario');
}

// Función para generar un reporte de optimización
function generarReporte() {
  console.log('\n📊 REPORTE DE OPTIMIZACIÓN');
  console.log('============================');
  
  const originalDir = CATALOGO_DIR;
  const optimizedDir = OUTPUT_DIR;
  
  if (!fs.existsSync(originalDir) || !fs.existsSync(optimizedDir)) {
    console.log('❌ No se pueden generar reportes sin los directorios necesarios');
    return;
  }
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalImages = 0;
  
  function calcularTamanos(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        calcularTamanos(itemPath);
      } else {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'].includes(ext)) {
          totalImages++;
          totalOriginalSize += stats.size;
        }
      }
    }
  }
  
  calcularTamanos(originalDir);
  calcularTamanos(optimizedDir);
  
  const compressionRatio = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`📸 Total de imágenes: ${totalImages}`);
  console.log(`📦 Tamaño original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Tamaño optimizado: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Ahorro de espacio: ${compressionRatio}%`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--reporte')) {
    generarReporte();
  } else {
    optimizarCatalogo();
  }
}

module.exports = {
  optimizarCatalogo,
  generarReporte,
  optimizarImagen
}; 