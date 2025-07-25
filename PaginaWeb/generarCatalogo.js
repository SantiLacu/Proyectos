// generarCatalogo.js
const fs = require('fs');
const path = require('path');

const CATALOGO_DIR = path.join(__dirname, 'catalogo');
const OUTPUT_FILE = path.join(__dirname, 'catalogo.json');

function leerInfoTxt(ruta) {
  const lineas = fs.readFileSync(ruta, 'utf-8').trim().split('\n');
  return {
    nombre: lineas[0]?.trim() || '',
    precio: parseInt(lineas[1]?.trim().replace(/\./g, ''), 10) || 0,
    descripcion: lineas[2]?.trim() || ''
  };
}

function obtenerImagenes(rutaImagenes, categoria, producto) {
  if (!fs.existsSync(rutaImagenes)) return [];
  return fs.readdirSync(rutaImagenes)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(f => `Catalogo/${categoria}/${producto}/imagenes/${f}`);
}

function recorrerCatalogo() {
  const categorias = fs.readdirSync(CATALOGO_DIR).filter(cat =>
    fs.statSync(path.join(CATALOGO_DIR, cat)).isDirectory()
  );
  let catalogo = [];

  categorias.forEach(categoria => {
    const rutaCategoria = path.join(CATALOGO_DIR, categoria);
    const productos = fs.readdirSync(rutaCategoria).filter(prod =>
      fs.statSync(path.join(rutaCategoria, prod)).isDirectory()
    );
    productos.forEach(producto => {
      const rutaProducto = path.join(rutaCategoria, producto);
      const infoPath = path.join(rutaProducto, 'info.txt');
      const imagenesPath = path.join(rutaProducto, 'imagenes');
      if (fs.existsSync(infoPath)) {
        const info = leerInfoTxt(infoPath);
        const imagenes = obtenerImagenes(imagenesPath, categoria, producto);
        catalogo.push({
          categoria: categoria.toLowerCase(),
          nombre: info.nombre,
          precio: info.precio,
          descripcion: info.descripcion,
          imagenes
        });
      }
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalogo, null, 2), 'utf-8');
  console.log('✅ catalogo.json generado correctamente');
}

recorrerCatalogo();