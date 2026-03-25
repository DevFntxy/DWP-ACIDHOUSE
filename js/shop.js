// shop.js - Manejo de productos dinámicos, carrito, filtros y UI adicional

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM (constantes) ---
    const elements = {
        productsGrid: document.getElementById('productsGrid'),
        searchInput: document.getElementById('searchInput'),
        btnAgregar: document.getElementById('btnAgregarProducto'),
        modal: document.getElementById('productModal'),
        cancelarModal: document.getElementById('cancelarModal'),
        guardarProducto: document.getElementById('guardarProducto'),
        prodNombre: document.getElementById('prodNombre'),
        prodPrecio: document.getElementById('prodPrecio'),
        prodImagen: document.getElementById('prodImagen'),
        cartIcon: document.querySelector('.cart-icon'),
        cartPanel: document.getElementById('cartPanel'),
        closeCart: document.getElementById('closeCart'),
        cartItemsDiv: document.getElementById('cartItems'),
        cartTotalSpan: document.getElementById('cartTotal'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        toggleInfoBtn: document.getElementById('toggleInfoBtn'),
        infoSeccion: document.getElementById('infoSeccion')
    };

    // Verificar elemento crítico
    if (!elements.productsGrid) {
        console.error('No se encontró el grid de productos');
        return;
    }

    // --- Estados ---
    let productos = [
        { nombre: 'Lasser – Hockey (Vinilo)', precio: 25000, imagen: 'assets/img/product1.jpg' },
        { nombre: 'Fanso – Acid House', precio: 30000, imagen: 'assets/img/product2.jpg' },
        { nombre: 'FANSO – Música para Lagartos (Vinilo)', precio: 28000, imagen: 'assets/img/product3.jpg' }
    ];
    let carrito = [];
    let darkMode = false;
    let infoVisible = false;

    // --- Funciones auxiliares ---
    const formatearPrecio = (precio) => `$${precio.toLocaleString()}`;

    const limpiarModal = () => {
        if (elements.prodNombre) elements.prodNombre.value = '';
        if (elements.prodPrecio) elements.prodPrecio.value = '';
        if (elements.prodImagen) elements.prodImagen.value = '';
    };

    // --- Renderizado de productos (incluye título y botón "Ver más") ---
    function renderProductos(productosArray) {
        // Guardar referencia al título y botón si ya existen (para no perder estado)
        const tituloExistente = document.getElementById('mainTitle');
        const verMasBtnExistente = document.getElementById('verMasBtn');
        const textoAdicionalExistente = document.getElementById('textoAdicional');

        let tituloHTML = '';
        let verMasHTML = '';

        if (tituloExistente) {
            tituloHTML = tituloExistente.outerHTML;
        } else {
            tituloHTML = `<h1 id="mainTitle" style="grid-column: 1 / -1; text-align: center; margin-bottom: 10px; color: var(--dark); transition: color 0.3s;">Bienvenido a Acid House</h1>`;
        }

        if (verMasBtnExistente && textoAdicionalExistente) {
            verMasHTML = `<div style="grid-column: 1 / -1; text-align: center; margin-bottom: 20px;">
                <button id="verMasBtn" class="btn-vermas" style="background: var(--coral); width: auto; padding: 8px 20px;">${verMasBtnExistente.textContent}</button>
                <div id="textoAdicional" style="display: ${textoAdicionalExistente.style.display};">${textoAdicionalExistente.innerHTML}</div>
            </div>`;
        } else {
            verMasHTML = `<div style="grid-column: 1 / -1; text-align: center; margin-bottom: 20px;">
                <button id="verMasBtn" class="btn-vermas" style="background: var(--coral); width: auto; padding: 8px 20px;">Ver más</button>
                <div id="textoAdicional" style="display: none; margin-top: 15px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <p>Acid House es una tienda independiente de música y ropa con estilo alternativo. Fundada en 2020, ofrecemos vinilos, ropa y accesorios para los amantes de la música electrónica y la cultura underground. Nuestro catálogo incluye artistas locales e internacionales.</p>
                </div>
            </div>`;
        }

        // Limpiar grid y agregar título y botón
        elements.productsGrid.innerHTML = tituloHTML + verMasHTML;

        // Agregar productos
        productosArray.forEach((prod, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <h4>${prod.nombre}</h4>
                <span class="price">${formatearPrecio(prod.precio)}</span>
                <div class="card-buttons">
                    <button class="btn-carrito" data-index="${index}">🛒 Agregar</button>
                    <button class="btn-eliminar" data-index="${index}">🗑️ Eliminar</button>
                </div>
            `;
            elements.productsGrid.appendChild(card);
        });

        // Reasignar referencias a elementos dinámicos y agregar efecto hover al título
        actualizarReferencias();
        agregarHoverTitulo();
    }

    function actualizarReferencias() {
        elements.mainTitle = document.getElementById('mainTitle');
        elements.verMasBtn = document.getElementById('verMasBtn');
        elements.textoAdicional = document.getElementById('textoAdicional');
    }

    // Efecto hover para el título (cambia el texto)
    function agregarHoverTitulo() {
        if (elements.mainTitle) {
            elements.mainTitle.addEventListener('mouseenter', () => {
                elements.mainTitle.textContent = '🎵 Explora nuestros productos 🎵';
            });
            elements.mainTitle.addEventListener('mouseleave', () => {
                elements.mainTitle.textContent = 'Bienvenido a Acid House';
            });
        }
    }

    // --- Renderizado del carrito ---
    function renderCarrito() {
        if (!elements.cartItemsDiv || !elements.cartTotalSpan) return;

        if (carrito.length === 0) {
            elements.cartItemsDiv.innerHTML = '<div class="cart-empty">El carrito está vacío</div>';
            elements.cartTotalSpan.textContent = 'Total: $0';
            return;
        }

        let total = 0;
        const itemsHtml = carrito.map((item, idx) => {
            total += item.precio * item.cantidad;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.nombre}</h4>
                        <span class="cart-item-precio">${formatearPrecio(item.precio)} x ${item.cantidad}</span>
                    </div>
                    <button class="cart-item-eliminar" data-cartindex="${idx}">✖</button>
                </div>
            `;
        }).join('');

        elements.cartItemsDiv.innerHTML = itemsHtml;
        elements.cartTotalSpan.textContent = `Total: ${formatearPrecio(total)}`;
    }

    // --- Funciones de negocio ---
    function agregarAlCarrito(indexProducto) {
        const prod = productos[indexProducto];
        const existente = carrito.find(item => item.nombre === prod.nombre);
        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ ...prod, cantidad: 1 });
        }
        renderCarrito();
        if (elements.cartPanel) elements.cartPanel.style.display = 'block';
    }

    function eliminarProducto(index) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            const productoEliminado = productos[index];
            productos.splice(index, 1);
            renderProductos(productos);
            carrito = carrito.filter(item => item.nombre !== productoEliminado.nombre);
            renderCarrito();
        }
    }

    function filtrarProductos() {
        const texto = elements.searchInput.value.toLowerCase();
        const filtrados = productos.filter(prod => prod.nombre.toLowerCase().includes(texto));
        renderProductos(filtrados);
    }

    // --- Eventos (delegación) ---
    if (elements.productsGrid) {
        elements.productsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-carrito')) {
                const index = e.target.dataset.index;
                if (index !== undefined) agregarAlCarrito(parseInt(index, 10));
            } else if (e.target.classList.contains('btn-eliminar')) {
                const index = e.target.dataset.index;
                if (index !== undefined) eliminarProducto(parseInt(index, 10));
            }
        });
    }

    if (elements.cartItemsDiv) {
        elements.cartItemsDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-item-eliminar')) {
                const idx = e.target.dataset.cartindex;
                if (idx !== undefined) {
                    carrito.splice(parseInt(idx, 10), 1);
                    renderCarrito();
                }
            }
        });
    }

    // --- Eventos para elementos fijos ---
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', filtrarProductos);
    }

    if (elements.btnAgregar && elements.modal) {
        elements.btnAgregar.addEventListener('click', () => {
            elements.modal.style.display = 'flex';
        });
    }

    if (elements.cancelarModal && elements.modal) {
        elements.cancelarModal.addEventListener('click', () => {
            elements.modal.style.display = 'none';
            limpiarModal();
        });
    }

    if (elements.guardarProducto) {
        elements.guardarProducto.addEventListener('click', () => {
            const nombre = elements.prodNombre?.value.trim();
            const precio = parseInt(elements.prodPrecio?.value.trim(), 10);
            const imagen = elements.prodImagen?.value.trim();

            if (!nombre || isNaN(precio) || precio <= 0 || !imagen) {
                alert('Completa todos los campos correctamente');
                return;
            }

            productos.push({ nombre, precio, imagen });
            renderProductos(productos);
            elements.modal.style.display = 'none';
            limpiarModal();
        });
    }

    // Carrito: mostrar/ocultar
    if (elements.cartIcon && elements.cartPanel) {
        elements.cartIcon.addEventListener('click', () => {
            elements.cartPanel.style.display = elements.cartPanel.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (elements.closeCart && elements.cartPanel) {
        elements.closeCart.addEventListener('click', () => {
            elements.cartPanel.style.display = 'none';
        });
    }

    // --- Funciones dinámicas (tema, info, ver más) ---
    // Tema oscuro
    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('click', () => {
            const root = document.documentElement;
            if (!darkMode) {
                root.style.setProperty('--blue', '#2c3e50');
                root.style.setProperty('--coral', '#c44545');
                root.style.setProperty('--mint', '#34495e');
                root.style.setProperty('--dark', '#ecf0f1');
                document.body.style.background = '#34495e';
                elements.darkModeToggle.textContent = '☀️';
            } else {
                root.style.setProperty('--blue', '#6F8FB7');
                root.style.setProperty('--coral', '#E69686');
                root.style.setProperty('--mint', '#A9C8C9');
                root.style.setProperty('--dark', '#222');
                document.body.style.background = '#A9C8C9';
                elements.darkModeToggle.textContent = '🌓';
            }
            darkMode = !darkMode;
        });
    }

    // Mostrar/ocultar sección de información (sidebar) con mejora visual
    if (elements.toggleInfoBtn && elements.infoSeccion) {
        elements.toggleInfoBtn.addEventListener('click', () => {
            const isHidden = elements.infoSeccion.style.display === 'none';
            elements.infoSeccion.style.display = isHidden ? 'block' : 'none';
            // Cambiar texto y estilo del botón
            elements.toggleInfoBtn.innerHTML = isHidden ? '📄 Ocultar información' : '📄 Ver más información';
            elements.toggleInfoBtn.classList.toggle('btn-info-active', isHidden);
        });
    }

    // Botón "Ver más" debajo del título (evento delegado porque se recrea)
    elements.productsGrid.addEventListener('click', (e) => {
        if (e.target.id === 'verMasBtn') {
            e.preventDefault();
            const textoDiv = document.getElementById('textoAdicional');
            const btn = e.target;
            if (textoDiv) {
                if (textoDiv.style.display === 'none') {
                    textoDiv.style.display = 'block';
                    btn.textContent = 'Ver menos';
                } else {
                    textoDiv.style.display = 'none';
                    btn.textContent = 'Ver más';
                }
            }
        }
    });

    // Inicializar renderizado
    renderProductos(productos);
    actualizarReferencias();
});