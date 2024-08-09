// Variables del carrito
let carrito = [];
const listaCarrito = document.getElementById('lista-carrito');
const totalElement = document.getElementById('total');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
const verCarritoBtn = document.getElementById('ver-carrito');
const carritoSection = document.getElementById('carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const modal = document.getElementById('modal');
const cerrarModalBtn = document.getElementById('cerrar-modal');
const resumenCompraElement = document.getElementById('resumen-compra');
const pagarBtn = document.getElementById('pagar');
let productos = [];

// Función para cargar productos desde JSON
async function cargarProductos() {
    try {
        const response = await fetch('db/productos.json'); // Ruta del archivo JSON
        productos = await response.json();
        
        const productosSection = document.getElementById('productos');
        productosSection.innerHTML = '';

        productos.forEach(producto => {
            const productoElemento = document.createElement('div');
            productoElemento.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}" style="width: 100px; height: auto;">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            `;
            productosSection.appendChild(productoElemento);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const productoEnCarrito = carrito.find(p => p.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();

    // Mostrar notificación con SweetAlert2
 Swal.fire({
    title: '¡Producto agregado al carrito!',
    text: `${producto.nombre} ha sido añadido al carrito.`,
    icon: 'success',
    confirmButtonText: 'OK'
  });
}

// Función para ajustar la cantidad de un producto
function ajustarCantidad(id, ajuste) {
    const productoEnCarrito = carrito.find(p => p.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += ajuste;
        if (productoEnCarrito.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            actualizarCarrito();
        }
    }
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    actualizarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;
    let totalProductos = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        totalProductos += producto.cantidad;
        
        const itemCarrito = document.createElement('li');
        itemCarrito.innerHTML = `
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${subtotal.toFixed(2)}
            <div class="cantidad-boton">
                <button onclick="ajustarCantidad(${producto.id}, -1)">-</button>
                <button onclick="ajustarCantidad(${producto.id}, 1)">+</button>
                <button onclick="eliminarDelCarrito(${producto.id})">x</button>
            </div>
        `;
        listaCarrito.appendChild(itemCarrito);
    });

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    
    // Actualizar el contador de productos
    contadorCarrito.textContent = totalProductos;

    // Mostrar u ocultar el contador
    contadorCarrito.style.display = totalProductos > 0 ? 'inline-block' : 'none';

    // Mostrar u ocultar el carrito
    carritoSection.style.display = totalProductos > 0 ? 'block' : 'none';

    // Guardar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para mostrar el carrito
function mostrarCarrito() {
    carritoSection.style.display = 'block';
}

// Función para ocultar el carrito
function ocultarCarrito() {
    carritoSection.style.display = 'none';
}

// Función para mostrar el modal de resumen de compra
function mostrarModal() {
    const resumen = carrito.map(p => `${p.nombre} - $${p.precio} x ${p.cantidad} = $${(p.precio * p.cantidad).toFixed(2)}`).join('\n');
    resumenCompraElement.textContent = resumen + `\n\nTotal: $${totalElement.textContent.split('$')[1]}`;
    modal.style.display = 'block';
}

// Función para ocultar el modal
function ocultarModal() {
    modal.style.display = 'none';
}

function manejarPago() {
    Swal.fire({
        title: '¡Gracias por su compra!',
        text: 'Su compra ha sido procesada.',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        vaciarCarrito();
        ocultarModal();
    });
}

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoGuardado) {
        carrito = carritoGuardado;
        actualizarCarrito();
    }
}

// Event Listeners
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
cerrarCarritoBtn.addEventListener('click', ocultarCarrito);
verCarritoBtn.addEventListener('click', mostrarCarrito);
finalizarCompraBtn.addEventListener('click', mostrarModal);
cerrarModalBtn.addEventListener('click', ocultarModal);
pagarBtn.addEventListener('click', manejarPago);

// Mostrar productos y carrito al cargar la página
cargarProductos().then(cargarCarrito);





