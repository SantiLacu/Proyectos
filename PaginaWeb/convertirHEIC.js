// convertirHEIC.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CATALOGO_DIR = path.join(__dirname, 'Catalogo');
const OUTPUT_DIR = path.join(__dirname, 'CatalogoOptimizado');

// Configuración de conversión
const CONFIG_CONVERSION = {
  webp: {
    quality: 85,
    effort: 6
  },
  jpeg: {
    quality: 90,
    progressive: true
  }
};

// Función para crear directorio si no existe
function crearDirectorioSiNoExiste(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Función para convertir HEIC a formato web
async function convertirHEIC(inputPath, outputPath, format = 'webp') {
  try {
    console.log(`🔄 Convirtiendo: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    
    let pipeline = sharp(inputPath);
    
    // Aplicar optimizaciones según el formato de salida
    if (format === 'webp') {
      pipeline = pipeline.webp({
        quality: CONFIG_CONVERSION.webp.quality,
        effort: CONFIG_CONVERSION.webp.effort
      });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({
        quality: CONFIG_CONVERSION.jpeg.quality,
        progressive: CONFIG_CONVERSION.jpeg.progressive
      });
    }
    
    await pipeline.toFile(outputPath);
    
    // Mostrar información de conversión
    const originalStats = fs.statSync(inputPath);
    const convertedStats = fs.statSync(outputPath);
    const compressionRatio = ((originalStats.size - convertedStats.size) / originalStats.size * 100).toFixed(1);
    
    console.log(`✅ Convertido: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    console.log(`📊 Tamaño: ${originalStats.size} -> ${convertedStats.size} bytes (${compressionRatio}% reducción)`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error convirtiendo ${inputPath}:`, error.message);
    return false;
  }
}

// Función para procesar archivos HEIC en un directorio
async function procesarHEICEnDirectorio(dirPath, outputDir, format = 'webp') {
  const items = fs.readdirSync(dirPath);
  let archivosHEIC = [];
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Crear directorio correspondiente en output
      const newOutputDir = path.join(outputDir, item);
      crearDirectorioSiNoExiste(newOutputDir);
      
      // Procesar subdirectorio
      const subArchivos = await procesarHEICEnDirectorio(itemPath, newOutputDir, format);
      archivosHEIC = archivosHEIC.concat(subArchivos);
      
    } else if (stats.isFile()) {
      // Verificar si es un archivo HEIC
      const ext = path.extname(item).toLowerCase();
      if (ext === '.heic' || ext === '.heif') {
        const fileName = path.basename(item, ext);
        const outputPath = path.join(outputDir, `${fileName}.${format}`);
        
        const success = await convertirHEIC(itemPath, outputPath, format);
        if (success) {
          archivosHEIC.push({
            original: itemPath,
            convertido: outputPath,
            formato: format
          });
        }
      }
    }
  }
  
  return archivosHEIC;
}

// Función principal para convertir todo el catálogo
async function convertirCatalogoHEIC(format = 'webp') {
  console.log(`🔄 Iniciando conversión de archivos HEIC a ${format.toUpperCase()}...`);
  
  if (!fs.existsSync(CATALOGO_DIR)) {
    console.error('❌ No se encontró la carpeta Catalogo/');
    return;
  }
  
  // Crear directorio de salida
  crearDirectorioSiNoExiste(OUTPUT_DIR);
  
  try {
    const archivosConvertidos = await procesarHEICEnDirectorio(CATALOGO_DIR, OUTPUT_DIR, format);
    
    console.log('\n📊 REPORTE DE CONVERSIÓN:');
    console.log(`📁 Total de archivos HEIC convertidos: ${archivosConvertidos.length}`);
    console.log(`🎯 Formato de salida: ${format.toUpperCase()}`);
    
    if (archivosConvertidos.length > 0) {
      console.log('\n📋 Archivos convertidos:');
      archivosConvertidos.forEach((archivo, index) => {
        console.log(`  ${index + 1}. ${path.basename(archivo.original)} -> ${path.basename(archivo.convertido)}`);
      });
      
      console.log('\n💡 RECOMENDACIONES:');
      console.log('• Reemplaza los archivos HEIC originales con los convertidos');
      console.log('• Actualiza las referencias en el código para usar los nuevos archivos');
      console.log('• Considera usar WebP para mejor compatibilidad web');
      
    } else {
      console.log('ℹ️  No se encontraron archivos HEIC para convertir');
    }
    
    console.log('\n✅ Conversión completada');
    
  } catch (error) {
    console.error('❌ Error durante la conversión:', error.message);
  }
}

// Función para mostrar información sobre archivos HEIC
function analizarArchivosHEIC() {
  console.log('🔍 Analizando archivos HEIC en el catálogo...');
  
  if (!fs.existsSync(CATALOGO_DIR)) {
    console.error('❌ No se encontró la carpeta Catalogo/');
    return;
  }
  
  const archivosHEIC = [];
  
  function buscarHEIC(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        buscarHEIC(itemPath);
      } else if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (ext === '.heic' || ext === '.heif') {
          archivosHEIC.push({
            ruta: itemPath,
            nombre: item,
            tamaño: stats.size,
            rutaRelativa: path.relative(CATALOGO_DIR, itemPath)
          });
        }
      }
    }
  }
  
  buscarHEIC(CATALOGO_DIR);
  
  console.log(`\n📊 ANÁLISIS DE ARCHIVOS HEIC:`);
  console.log(`📁 Total encontrados: ${archivosHEIC.length}`);
  
  if (archivosHEIC.length > 0) {
    console.log('\n📋 Archivos HEIC detectados:');
    archivosHEIC.forEach((archivo, index) => {
      const tamañoMB = (archivo.tamaño / 1024 / 1024).toFixed(2);
      console.log(`  ${index + 1}. ${archivo.nombre} (${tamañoMB} MB) - ${archivo.rutaRelativa}`);
    });
    
    const tamañoTotal = archivosHEIC.reduce((total, archivo) => total + archivo.tamaño, 0);
    const tamañoTotalMB = (tamañoTotal / 1024 / 1024).toFixed(2);
    
    console.log(`\n💾 Tamaño total: ${tamañoTotalMB} MB`);
    console.log(`💡 Recomendación: Convertir a WebP para reducir ~70% el tamaño`);
    
  } else {
    console.log('✅ No se encontraron archivos HEIC en el catálogo');
  }
}

// Función para mostrar ayuda
function mostrarAyuda() {
  console.log(`
🔄 CONVERTIDOR DE ARCHIVOS HEIC

Uso:
  node convertirHEIC.js [comando] [opciones]

Comandos:
  convertir [formato]  - Convertir archivos HEIC a formato especificado (webp/jpeg)
  analizar            - Analizar archivos HEIC en el catálogo
  ayuda               - Mostrar esta ayuda

Formatos soportados:
  webp               - Formato WebP (recomendado para web)
  jpeg               - Formato JPEG (máxima compatibilidad)

Ejemplos:
  node convertirHEIC.js convertir webp
  node convertirHEIC.js convertir jpeg
  node convertirHEIC.js analizar
  node convertirHEIC.js ayuda

Notas:
  • Los archivos convertidos se guardan en CatalogoOptimizado/
  • WebP ofrece mejor compresión pero menor compatibilidad
  • JPEG ofrece máxima compatibilidad pero archivos más grandes
  `);
}

// Ejecutar según argumentos de línea de comandos
if (require.main === module) {
  const comando = process.argv[2];
  const formato = process.argv[3];
  
  switch (comando) {
    case 'convertir':
      if (!formato || !['webp', 'jpeg'].includes(formato)) {
        console.error('❌ Formato no válido. Usa: webp o jpeg');
        process.exit(1);
      }
      convertirCatalogoHEIC(formato);
      break;
      
    case 'analizar':
      analizarArchivosHEIC();
      break;
      
    case 'ayuda':
    case 'help':
    case undefined:
      mostrarAyuda();
      break;
      
    default:
      console.error('❌ Comando no válido. Usa: convertir, analizar, o ayuda');
      process.exit(1);
  }
}

module.exports = { convertirCatalogoHEIC, analizarArchivosHEIC }; 