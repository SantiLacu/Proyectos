// Menú móvil
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', function() {
  navMenu.classList.toggle('show-menu');
  navToggle.classList.toggle('is-active');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
    navToggle.classList.remove('is-active');
  });
});

let productosGlobal = [];
let categoriaActual = 'todos';

// Función para renderizar los filtros de categoría dinámicamente
function renderizarFiltros(productos) {
  const filtrosContainer = document.querySelector('.filtros');
  // Extraer categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoria))];

  // Generar HTML de los botones
  filtrosContainer.innerHTML = `
    <button data-categoria="todos" class="active">Todos</button>
    ${categorias.map(cat => `
      <button data-categoria="${cat.replace(/\s/g, '-')}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
    `).join('')}
  `;

  // Añadir event listeners a los nuevos botones
  filtrosContainer.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
      filtrosContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      categoriaActual = this.getAttribute('data-categoria');
      renderizarProductos();
    });
  });
}

fetch('catalogo.json?' + new Date().getTime())
  .then(res => res.json())
  .then(productos => {
    productosGlobal = productos;
    renderizarFiltros(productos);
    renderizarProductos();
  })
  .catch(err => {
    document.querySelector('.productos-grid').innerText = 'No se pudo cargar el catálogo.';
    console.error(err);
  });

function renderizarProductos() {
  const grid = document.querySelector('.productos-grid');
  grid.innerHTML = '';
  let productosFiltrados = productosGlobal;
  if (categoriaActual && categoriaActual !== 'todos') {
    productosFiltrados = productosGlobal.filter(p => p.categoria.replace(/\s/g, '-') === categoriaActual);
  }
  if (productosFiltrados.length === 0) {
    grid.innerHTML = '<div class="sin-productos">No hay productos en esta categoría.</div>';
    return;
  }
  productosFiltrados.forEach((prod, idx) => {
    const div = document.createElement('div');
    div.className = 'producto';
    let indicadores = '';
    if (prod.imagenes.length > 1) {
      indicadores = `<div class="producto-indicadores">${prod.imagenes.map((_,i) => `<span class="producto-indicador${i===0?' activo':''}"></span>`).join('')}</div>`;
    }
    div.innerHTML = `
      <div class="producto-img-container">
        <img src="${prod.imagenes[0]}" alt="${prod.nombre}" class="producto-img">
        ${indicadores}
      </div>
    `;
    div.addEventListener('click', () => mostrarModal(productosGlobal.indexOf(prod)));
    grid.appendChild(div);

    // Slideshow automático de imágenes con transición profesional
    if (prod.imagenes.length > 1) {
      let imgIdx = 0;
      const imgEl = div.querySelector('.producto-img');
      const puntos = div.querySelectorAll('.producto-indicador');

      // Función para cambiar imagen con transición suave
      function cambiarImagen() {
        imgEl.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
        imgEl.style.opacity = '0';
        imgEl.style.transform = 'scale(0.95)';

        setTimeout(() => {
          imgIdx = (imgIdx + 1) % prod.imagenes.length;
          imgEl.src = prod.imagenes[imgIdx];
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';

          // Actualizar indicadores
          puntos.forEach((p,i) => p.classList.toggle('activo', i===imgIdx));

          // Resetear transición después de completar
          setTimeout(() => {
            imgEl.style.transition = '';
          }, 600);
        }, 300);
      }

      // Intervalo 25% más lento (2500ms en lugar de 2000ms)
      let intervalId = setInterval(cambiarImagen, 2500);

      // Pausar slideshow al pasar el mouse
      div.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
        // Efecto hover sutil
        imgEl.style.transition = 'transform 0.3s ease-out';
        imgEl.style.transform = 'scale(1.02)';
      });

      div.addEventListener('mouseleave', () => {
        // Restaurar escala normal
        imgEl.style.transform = 'scale(1)';
        // Reiniciar slideshow
        intervalId = setInterval(cambiarImagen, 2500);
      });
    }
  });
}

// Modal
const modal = document.getElementById('producto-modal');
const modalImg = modal.querySelector('.modal-imagen');
const modalNombre = modal.querySelector('.modal-nombre');
const modalPrecio = modal.querySelector('.modal-precio');
const modalDescripcion = modal.querySelector('.modal-descripcion');
const modalWhatsapp = modal.querySelector('.modal-whatsapp');
let imagenActual = 0;
let imagenesProducto = [];

function mostrarModal(idx) {
  const prod = productosGlobal[idx];
  imagenesProducto = prod.imagenes;
  imagenActual = 0;
  actualizarModal(prod);
  modal.style.display = 'block';
  // Enfocar el modal para accesibilidad
  modal.querySelector('.modal-cerrar').focus();

  // Configurar gestos táctiles para el modal
  configurarGestosTactiles();
}

function actualizarModal(prod) {
  modalImg.src = imagenesProducto[imagenActual];
  modalImg.alt = prod.nombre;
  modalNombre.textContent = prod.nombre;
  modalPrecio.textContent = `$${prod.precio}`;
  modalDescripcion.textContent = prod.descripcion;
  modalWhatsapp.href = `https://api.whatsapp.com/send?phone=5491170583125&text=Hola,%20quiero%20comprar%20${encodeURIComponent(prod.nombre)}`;
}

modal.querySelector('.modal-cerrar').onclick = () => modal.style.display = 'none';
modal.querySelector('.modal-flecha-izq').onclick = () => {
  imagenActual = (imagenActual - 1 + imagenesProducto.length) % imagenesProducto.length;
  modalImg.src = imagenesProducto[imagenActual];
};
modal.querySelector('.modal-flecha-der').onclick = () => {
  imagenActual = (imagenActual + 1) % imagenesProducto.length;
  modalImg.src = imagenesProducto[imagenActual];
};

// Cerrar modal al hacer click en el fondo
modal.querySelector('.modal-fondo').addEventListener('click', function(e) {
  // Solo cerrar si se hace click directamente en el fondo, no en elementos hijos
  if (e.target === this) {
    modal.style.display = 'none';
  }
});

// Prevenir que los clicks en la galería cierren el modal
modal.querySelector('.modal-galeria').addEventListener('click', function(e) {
  e.stopPropagation();
});

// Prevenir que los clicks en la información cierren el modal
modal.querySelector('.modal-info').addEventListener('click', function(e) {
  e.stopPropagation();
});

// ========================================
// FUNCIONALIDADES DE TECLADO Y TÁCTILES
// ========================================
// - Teclas de flecha: Navegar entre imágenes en el modal
// - Escape: Cerrar modal
// - Flechas en filtros: Navegar entre categorías
// - Home/End: Ir al primer/último filtro
// - Deslizamiento táctil: Navegar entre imágenes en móviles

// Función para configurar gestos táctiles
function configurarGestosTactiles() {
  const modalGaleria = modal.querySelector('.modal-galeria');
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let isSwiping = false;

  // Detectar inicio del toque
  modalGaleria.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = false;
  }, { passive: true });

  // Detectar movimiento del toque
  modalGaleria.addEventListener('touchmove', function(e) {
    if (!startX || !startY) return;

    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    // Si el movimiento horizontal es mayor que el vertical, es un swipe horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      isSwiping = true;
      e.preventDefault(); // Prevenir scroll de la página
    }
  }, { passive: false });

  // Detectar fin del toque
  modalGaleria.addEventListener('touchend', function(e) {
    if (!isSwiping || !startX || !endX) return;

    const diffX = startX - endX;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe izquierda - siguiente imagen
        imagenActual = (imagenActual + 1) % imagenesProducto.length;
        modalImg.src = imagenesProducto[imagenActual];
      } else {
        // Swipe derecha - imagen anterior
        imagenActual = (imagenActual - 1 + imagenesProducto.length) % imagenesProducto.length;
        modalImg.src = imagenesProducto[imagenActual];
      }
    }

    // Resetear variables
    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
    isSwiping = false;
  }, { passive: true });
}

// Navegación por teclado en el modal
document.addEventListener('keydown', function(e) {
  if (modal.style.display === 'block') {
    switch(e.key) {
      case 'Escape':
        modal.style.display = 'none';
        break;
      case 'ArrowLeft':
        e.preventDefault();
        imagenActual = (imagenActual - 1 + imagenesProducto.length) % imagenesProducto.length;
        modalImg.src = imagenesProducto[imagenActual];
        break;
      case 'ArrowRight':
        e.preventDefault();
        imagenActual = (imagenActual + 1) % imagenesProducto.length;
        modalImg.src = imagenesProducto[imagenActual];
        break;
    }
  }
});

// Navegación por teclado en los filtros del catálogo
document.addEventListener('keydown', function(e) {
  if (modal.style.display === 'none') { // Solo cuando el modal está cerrado
    const filtros = document.querySelectorAll('.filtros button');
    const filtroActivo = document.querySelector('.filtros button.active');

    if (filtroActivo) {
      const indexActivo = Array.from(filtros).indexOf(filtroActivo);

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (indexActivo - 1 + filtros.length) % filtros.length;
        filtros[prevIndex].click();
        filtros[prevIndex].focus();
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (indexActivo + 1) % filtros.length;
        filtros[nextIndex].click();
        filtros[nextIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        filtros[0].click();
        filtros[0].focus();
        break;
      case 'End':
        e.preventDefault();
        filtros[filtros.length - 1].click();
        filtros[filtros.length - 1].focus();
        break;
    }
    }
  }
});
