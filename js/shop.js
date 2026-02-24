// shop.js - Manejo de productos dinámicos, carrito y filtros

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const btnAgregar = document.getElementById('btnAgregarProducto');
    const modal = document.getElementById('productModal');
    const cancelarModal = document.getElementById('cancelarModal');
    const guardarProducto = document.getElementById('guardarProducto');
    const prodNombre = document.getElementById('prodNombre');
    const prodPrecio = document.getElementById('prodPrecio');
    const prodImagen = document.getElementById('prodImagen');
    const cartIcon = document.querySelector('.cart-icon');
    const cartPanel = document.getElementById('cartPanel');
    const closeCart = document.getElementById('closeCart');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');

    // Array de productos iniciales (para mantener coherencia con el HTML original)
    let productos = [
        { nombre: 'Lasser – Hockey (Vinilo)', precio: 25000, imagen: 'assets/img/product1.jpg' },
        { nombre: 'Fanso – Acid House', precio: 30000, imagen: 'assets/img/product2.jpg' },
        { nombre: 'FANSO – Música para Lagartos (Vinilo)', precio: 28000, imagen: 'assets/img/product3.jpg' }
    ];

    // Carrito
    let carrito = [];

    // Renderizar productos
    function renderProductos(productosArray) {
        productsGrid.innerHTML = '';
        productosArray.forEach((prod, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <h4>${prod.nombre}</h4>
                <span class="price">$${prod.precio.toLocaleString()}</span>
                <div class="card-buttons">
                    <button class="btn-carrito" data-index="${index}">🛒 Agregar</button>
                    <button class="btn-eliminar" data-index="${index}">🗑️ Eliminar</button>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    // Renderizar carrito
    function renderCarrito() {
        if (carrito.length === 0) {
            cartItemsDiv.innerHTML = '<div class="cart-empty">El carrito está vacío</div>';
            cartTotalSpan.textContent = 'Total: $0';
            return;
        }
        let html = '';
        let total = 0;
        carrito.forEach((item, idx) => {
            total += item.precio * item.cantidad;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.nombre}</h4>
                        <span class="cart-item-precio">$${item.precio.toLocaleString()} x ${item.cantidad}</span>
                    </div>
                    <button class="cart-item-eliminar" data-cartindex="${idx}">✖</button>
                </div>
            `;
        });
        cartItemsDiv.innerHTML = html;
        cartTotalSpan.textContent = `Total: $${total.toLocaleString()}`;

        // Eventos para eliminar items del carrito
        document.querySelectorAll('.cart-item-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.cartindex;
                carrito.splice(idx, 1);
                renderCarrito();
                // También podríamos actualizar algún contador si lo hubiera
            });
        });
    }

    // Agregar al carrito
    function agregarAlCarrito(indexProducto) {
        const prod = productos[indexProducto];
        const existente = carrito.find(item => item.nombre === prod.nombre);
        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ ...prod, cantidad: 1 });
        }
        renderCarrito();
        // Mostrar el carrito automáticamente (opcional)
        cartPanel.style.display = 'block';
    }

    // Eliminar producto del catálogo
    function eliminarProducto(index) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            productos.splice(index, 1);
            renderProductos(productos);
            // También eliminar del carrito si estaba
            carrito = carrito.filter(item => item.nombre !== productos[index]?.nombre);
            renderCarrito();
        }
    }

    // Filtrar productos por búsqueda
    function filtrarProductos() {
        const texto = searchInput.value.toLowerCase();
        const filtrados = productos.filter(prod => prod.nombre.toLowerCase().includes(texto));
        renderProductos(filtrados);
    }

    // Eventos
    searchInput.addEventListener('input', filtrarProductos);

    // Agregar producto nuevo
    btnAgregar.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelarModal.addEventListener('click', () => {
        modal.style.display = 'none';
        limpiarModal();
    });

    guardarProducto.addEventListener('click', () => {
        const nombre = prodNombre.value.trim();
        const precio = parseInt(prodPrecio.value.trim());
        const imagen = prodImagen.value.trim();

        if (!nombre || isNaN(precio) || precio <= 0 || !imagen) {
            alert('Completa todos los campos correctamente');
            return;
        }

        productos.push({ nombre, precio, imagen });
        renderProductos(productos);
        modal.style.display = 'none';
        limpiarModal();
    });

    function limpiarModal() {
        prodNombre.value = '';
        prodPrecio.value = '';
        prodImagen.value = '';
    }

    // Eventos delegados para botones de tarjetas
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-carrito')) {
            const index = e.target.dataset.index;
            agregarAlCarrito(parseInt(index));
        } else if (e.target.classList.contains('btn-eliminar')) {
            const index = e.target.dataset.index;
            eliminarProducto(parseInt(index));
        }
    });

    // Mostrar/ocultar carrito
    cartIcon.addEventListener('click', () => {
        cartPanel.style.display = cartPanel.style.display === 'block' ? 'none' : 'block';
    });

    closeCart.addEventListener('click', () => {
        cartPanel.style.display = 'none';
    });

    // Inicializar render
    renderProductos(productos);
});