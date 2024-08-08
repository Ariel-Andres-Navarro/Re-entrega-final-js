// Datos de productos
const productos = [
    { id: 1, nombre: 'Producto 1', precio: 10 },
    { id: 2, nombre: 'Producto 2', precio: 20 },
    { id: 3, nombre: 'Producto 3', precio: 30 }
];

// Variables del carrito
let carrito = [];
const listaCarrito = document.getElementById('lista-carrito');
const totalElement = document.getElementById('total');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
const verCarritoBtn = document.getElementById('ver-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const carritoSection = document.getElementById('carrito');
const contadorCarrito = document.getElementById('contador-carrito');

// Variables del modal
const modal = document.getElementById('modal');
const cerrarModalBtn = document.getElementById('cerrar-modal');
const resumenCompraElement = document.getElementById('resumen-compra');
const pagarBtn = document.getElementById('pagar');

// Función para mostrar productos
function mostrarProductos() {
    const productosSection = document.getElementById('productos');
    productosSection.innerHTML = '';

    productos.forEach(producto => {
        const productoElemento = document.createElement('div');
        productoElemento.classList.add('producto');
        productoElemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button data-id="${producto.id}">Agregar al carrito</button>
        `;
        productosSection.appendChild(productoElemento);
    });

    // Asignar eventos a los botones de agregar al carrito
    document.querySelectorAll('#productos button').forEach(button => {
        button.addEventListener('click', () => {
            agregarAlCarrito(parseInt(button.getAttribute('data-id')));
        });
    });
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
                <button class="ajustar-cantidad" data-id="${producto.id}" data-ajuste="-1">-</button>
                <button class="ajustar-cantidad" data-id="${producto.id}" data-ajuste="1">+</button>
                <button class="eliminar" data-id="${producto.id}">x</button>
            </div>
        `;
        listaCarrito.appendChild(itemCarrito);
    });

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    
    // Actualizar el contador de productos
    contadorCarrito.textContent = totalProductos;

    // Mostrar u ocultar el contador
    contadorCarrito.style.display = totalProductos > 0 ? 'inline-block' : 'none';

    // Guardar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Asignar eventos a los botones de ajustar cantidad y eliminar
    document.querySelectorAll('.ajustar-cantidad').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            const ajuste = parseInt(button.getAttribute('data-ajuste'));
            ajustarCantidad(id, ajuste);
        });
    });

    document.querySelectorAll('.eliminar').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            eliminarDelCarrito(id);
        });
    });
}

// Función para finalizar la compra
function finalizarCompra() {
    let resumenCompra = 'Resumen de la Compra:\n\n';
    let total = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        resumenCompra += `${producto.nombre}: $${producto.precio} x ${producto.cantidad} = $${subtotal.toFixed(2)}\n`;
        total += subtotal;
    });

    resumenCompra += `\nTotal: $${total.toFixed(2)}`;

    // Mostrar el resumen en el modal
    resumenCompraElement.textContent = resumenCompra;

    // Mostrar el modal
    modal.style.display = 'block';
}

// Función para cerrar el carrito (esconderlo)
function cerrarCarrito() {
    carritoSection.style.display = 'none';
}

// Función para mostrar el carrito (mostrarlo)
function verCarrito() {
    carritoSection.style.display = 'block';
}

// Función para cerrar el modal
function cerrarModal() {
    modal.style.display = 'none';
}

// Función para manejar el pago
function pagar() {
    alert('¡Gracias por su compra!');
    // Limpiar el carrito y ocultar el modal
    vaciarCarrito();
    cerrarModal();
}

// Event Listeners
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
cerrarCarritoBtn.addEventListener('click', cerrarCarrito);
verCarritoBtn.addEventListener('click', verCarrito);
finalizarCompraBtn.addEventListener('click', finalizarCompra);
cerrarModalBtn.addEventListener('click', cerrarModal);
pagarBtn.addEventListener('click', pagar);

// Cargar el carrito desde localStorage al cargar la página
function cargarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoGuardado) {
        carrito = carritoGuardado;
        actualizarCarrito();
    }
}

// Mostrar productos al cargar la página
mostrarProductos();
cargarCarrito();

// Ocultar el carrito por defecto
carritoSection.style.display = 'none';



