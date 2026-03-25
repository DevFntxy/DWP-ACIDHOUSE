/**
 * Muestra un mensaje tipo toast en el elemento con id "toast".
 * @param {string} message - Texto a mostrar
 * @param {string} type - Estilo: "success" o "error"
 */
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = "";
    toast.classList.add("show", type);
    setTimeout(() => {
        toast.classList.remove("show", type);
    }, 3000);
}

/**
 * Marca un campo como error, muestra toast y aplica animación.
 * @param {HTMLElement} input - Campo con error
 * @param {string} message - Mensaje de error
 */
function showError(input, message) {
    showToast(message, "error");
    input.classList.add("input-error");
    input.style.transform = "scale(1.02)";
    setTimeout(() => {
        input.style.transform = "scale(1)";
    }, 200);
}

/**
 * Limpia la clase de error de un campo.
 * @param {HTMLElement} input 
 */
function clearError(input) {
    input.classList.remove("input-error");
}

// =============================================================================
// INICIALIZACIÓN PRINCIPAL (cuando el DOM está listo)
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ========== PÁGINA DE LOGIN (login.html) ==========
    if (document.getElementById('loginForm')) {
        const form = document.getElementById('loginForm');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const rememberCheck = document.getElementById('rememberMe');
        const themeToggle = document.getElementById('themeToggle');
        let darkMode = false;

        // Cargar email recordado de localStorage
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheck.checked = true;
        }

        // Validación en tiempo real del email
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                showError(emailInput, '📧 El email es obligatorio');
            } else if (!emailRegex.test(email)) {
                showError(emailInput, '⚠️ Formato de email inválido');
            } else {
                clearError(emailInput);
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('input-error')) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(emailInput.value.trim())) {
                    clearError(emailInput);
                }
            }
        });

        // Validación de contraseña (solo obligatoria)
        passwordInput.addEventListener('blur', () => {
            if (passwordInput.value.trim() === '') {
                showError(passwordInput, '🔒 La contraseña es obligatoria');
            } else {
                clearError(passwordInput);
            }
        });

        // Envío del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (email === '') {
                showError(emailInput, '📧 El email es obligatorio');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError(emailInput, '⚠️ Formato de email inválido');
                isValid = false;
            }

            if (password === '') {
                showError(passwordInput, '🔒 La contraseña es obligatoria');
                isValid = false;
            }

            if (isValid) {
                if (rememberCheck.checked) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                showToast('✅ Inicio de sesión exitoso (simulado)', 'success');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1500);
            }
        });

        // Toggle de tema oscuro propio de login
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const root = document.documentElement;
                if (!darkMode) {
                    root.style.setProperty('--blue', '#2c3e50');
                    root.style.setProperty('--coral', '#c44545');
                    root.style.setProperty('--mint', '#34495e');
                    root.style.setProperty('--dark', '#77cacd');
                    document.body.style.background = '#000000';
                    themeToggle.textContent = '☀️';
                } else {
                    root.style.setProperty('--blue', '#0073ff');
                    root.style.setProperty('--coral', '#E69686');
                    root.style.setProperty('--mint', '#A9C8C9');
                    root.style.setProperty('--dark', '#222');
                    document.body.style.background = '#A9C8C9';
                    themeToggle.textContent = '🌙';
                }
                darkMode = !darkMode;
            });
        }
    }

    // ========== PÁGINA DE REGISTRO (register.html) ==========
    if (document.getElementById('registerForm')) {
        const form = document.getElementById('registerForm');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const strengthFill = document.getElementById('strengthFill');
        const passwordChecklist = document.getElementById('passwordChecklist');

        // Inicializar elementos ocultos
        passwordChecklist.style.display = "none";
        document.querySelector(".strength-bar").style.opacity = "0.3";

        // --- Validaciones en tiempo real ---

        // Nombre
        nameInput.addEventListener("blur", function () {
            if (nameInput.value.trim() === "") {
                showError(nameInput, "✏️ El nombre es obligatorio");
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, "📝 El nombre debe tener al menos 2 caracteres");
            } else {
                clearError(nameInput);
            }
        });

        // Email
        emailInput.addEventListener("blur", function () {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailValue = emailInput.value.trim();

            if (emailValue === "") {
                showError(emailInput, "📧 El email es obligatorio");
            } else if (!emailRegex.test(emailValue)) {
                showError(emailInput, "⚠️ Formato de email inválido");
            } else {
                clearError(emailInput);
            }
        });

        emailInput.addEventListener("input", function () {
            if (emailInput.value.trim() !== "" && emailInput.classList.contains("input-error")) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(emailInput.value.trim())) {
                    clearError(emailInput);
                }
            }
        });

        // Teléfono: solo dígitos y validación de 10 caracteres
        phoneInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 0 && this.value.length !== 10) {
                this.classList.add("input-error");
            } else {
                this.classList.remove("input-error");
            }
        });

        phoneInput.addEventListener("blur", function () {
            const phoneValue = this.value.trim();
            if (phoneValue === "") {
                showError(this, "📞 El teléfono es obligatorio");
            } else if (!/^\d{10}$/.test(phoneValue)) {
                showError(this, "📞 El teléfono debe tener 10 dígitos");
            } else {
                clearError(this);
            }
        });

        // Contraseña: mostrar checklist al enfocar
        passwordInput.addEventListener("focus", function () {
            passwordChecklist.style.display = "block";
            passwordChecklist.style.animation = "fadeIn 0.3s ease";
            document.querySelector(".strength-bar").style.opacity = "1";
        });

        // Medidor de fortaleza y checklist en tiempo real
        passwordInput.addEventListener("input", function () {
            const value = passwordInput.value;
            let strength = 0;

            passwordChecklist.style.display = "block";
            document.querySelector(".strength-bar").style.opacity = "1";

            const lengthItem = document.getElementById("length");
            const uppercaseItem = document.getElementById("uppercase");
            const specialItem = document.getElementById("special");

            if (value.length >= 8) {
                lengthItem.style.color = "#2e7d32";
                strength += 33;
            } else {
                lengthItem.style.color = "#d32f2f";
            }

            if (/[A-Z]/.test(value)) {
                uppercaseItem.style.color = "#2e7d32";
                strength += 33;
            } else {
                uppercaseItem.style.color = "#d32f2f";
            }

            if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                specialItem.style.color = "#2e7d32";
                strength += 34;
            } else {
                specialItem.style.color = "#d32f2f";
            }

            strengthFill.style.width = strength + "%";

            if (strength < 40) {
                strengthFill.style.background = "linear-gradient(90deg, #ff4444, #ff6b6b)";
            } else if (strength < 70) {
                strengthFill.style.background = "linear-gradient(90deg, #ffa000, #ffb74d)";
            } else {
                strengthFill.style.background = "linear-gradient(90deg, #2e7d32, #4caf50)";
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
            if (value.length > 0 && !passwordRegex.test(value)) {
                passwordInput.classList.add("input-error");
            } else {
                passwordInput.classList.remove("input-error");
            }
        });

        // Al perder foco, si está vacío ocultar checklist
        passwordInput.addEventListener("blur", function () {
            if (passwordInput.value.trim() === "") {
                setTimeout(() => {
                    if (passwordInput.value.trim() === "") {
                        passwordChecklist.style.display = "none";
                        document.querySelector(".strength-bar").style.opacity = "0.3";
                        passwordInput.classList.remove("input-error");
                    }
                }, 200);
            }
        });

        // Confirmar contraseña: validación en tiempo real
        confirmPasswordInput.addEventListener("input", function () {
            if (this.value.length > 0 && this.value !== passwordInput.value) {
                this.classList.add("input-error");
            } else {
                this.classList.remove("input-error");
            }
        });

        confirmPasswordInput.addEventListener("blur", function () {
            if (this.value.trim() === "") {
                showError(this, "🔐 Confirmar contraseña es obligatorio");
            } else if (this.value !== passwordInput.value) {
                showError(this, "🔐 Las contraseñas no coinciden");
            } else {
                clearError(this);
            }
        });

        // --- Validación final al enviar el formulario ---
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
            const phoneRegex = /^\d{10}$/;

            // Limpiar errores visuales de todos los campos
            [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(clearError);

            const nameValue = nameInput.value.trim();
            if (nameValue === "") {
                showError(nameInput, "✏️ El nombre es obligatorio");
                isValid = false;
            } else if (nameValue.length < 2) {
                showError(nameInput, "📝 El nombre debe tener al menos 2 caracteres");
                isValid = false;
            }

            const emailValue = emailInput.value.trim();
            if (emailValue === "") {
                showError(emailInput, "📧 El email es obligatorio");
                isValid = false;
            } else if (!emailRegex.test(emailValue)) {
                showError(emailInput, "⚠️ Formato de email inválido");
                isValid = false;
            }

            const phoneValue = phoneInput.value.trim();
            if (phoneValue === "") {
                showError(phoneInput, "📞 El teléfono es obligatorio");
                isValid = false;
            } else if (!phoneRegex.test(phoneValue)) {
                showError(phoneInput, "📞 El teléfono debe tener 10 dígitos");
                isValid = false;
            }

            const passwordValue = passwordInput.value;
            if (passwordValue === "") {
                showError(passwordInput, "🔒 La contraseña es obligatoria");
                isValid = false;
                passwordChecklist.style.display = "block";
                document.querySelector(".strength-bar").style.opacity = "1";
            } else if (!passwordRegex.test(passwordValue)) {
                showError(passwordInput, "🔒 La contraseña no cumple los requisitos");
                isValid = false;
                passwordChecklist.style.display = "block";
                document.querySelector(".strength-bar").style.opacity = "1";
            }

            const confirmValue = confirmPasswordInput.value.trim();
            if (confirmValue === "") {
                showError(confirmPasswordInput, "🔐 Confirmar contraseña es obligatorio");
                isValid = false;
            } else if (confirmValue !== passwordValue) {
                showError(confirmPasswordInput, "🔐 Las contraseñas no coinciden");
                isValid = false;
            }

            if (isValid) {
                showToast("Validando información...", "success");

                const userData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim()
                };

                localStorage.setItem("pendingUser", JSON.stringify(userData));

                setTimeout(() => {
                    window.location.href = "validation.html";
                }, 1500);
            }
        });

        // Animación de escala al enfocar campos
        const inputs = [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput];
        inputs.forEach(input => {
            input.addEventListener("focus", function () {
                this.style.transition = "transform 0.3s";
                this.style.transform = "scale(1.02)";
            });

            input.addEventListener("blur", function () {
                this.style.transform = "scale(1)";
            });
        });
    }

    // ========== PÁGINA DE TIENDA (shop.html / index.html) ==========
    if (document.getElementById('productsGrid')) {
        // Elementos del DOM
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

        if (!elements.productsGrid) {
            console.error('No se encontró el grid de productos');
            return; // Salir del bloque si no hay grid
        }

        // Estado de la tienda
        let productos = [
            { nombre: 'Lasser – Hockey (Vinilo)', precio: 25000, imagen: 'assets/img/product1.jpg' },
            { nombre: 'Fanso – Acid House', precio: 30000, imagen: 'assets/img/product2.jpg' },
            { nombre: 'FANSO – Música para Lagartos (Vinilo)', precio: 28000, imagen: 'assets/img/product3.jpg' }
        ];
        let carrito = [];
        let darkMode = false;
        let infoVisible = false; // no usado pero se mantiene por compatibilidad

        const formatearPrecio = (precio) => `$${precio.toLocaleString()}`;

        const limpiarModal = () => {
            if (elements.prodNombre) elements.prodNombre.value = '';
            if (elements.prodPrecio) elements.prodPrecio.value = '';
            if (elements.prodImagen) elements.prodImagen.value = '';
        };

        // Renderiza los productos en el grid, incluyendo título dinámico y botón "Ver más"
        function renderProductos(productosArray) {
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

            elements.productsGrid.innerHTML = tituloHTML + verMasHTML;

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

            // Actualizar referencias a elementos dinámicos y agregar efecto hover al título
            elements.mainTitle = document.getElementById('mainTitle');
            elements.verMasBtn = document.getElementById('verMasBtn');
            elements.textoAdicional = document.getElementById('textoAdicional');
            agregarHoverTitulo();
        }

        // Efecto hover sobre el título principal
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

        // Renderiza el contenido del carrito
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

        // Agrega un producto al carrito (acumula cantidades)
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

        // Elimina un producto de la lista y también del carrito si estaba
        function eliminarProducto(index) {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                const productoEliminado = productos[index];
                productos.splice(index, 1);
                renderProductos(productos);
                carrito = carrito.filter(item => item.nombre !== productoEliminado.nombre);
                renderCarrito();
            }
        }

        // Filtra productos según el texto de búsqueda
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

        // Búsqueda en tiempo real
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', filtrarProductos);
        }

        // Abrir modal para agregar producto
        if (elements.btnAgregar && elements.modal) {
            elements.btnAgregar.addEventListener('click', () => {
                elements.modal.style.display = 'flex';
            });
        }

        // Cerrar modal sin guardar
        if (elements.cancelarModal && elements.modal) {
            elements.cancelarModal.addEventListener('click', () => {
                elements.modal.style.display = 'none';
                limpiarModal();
            });
        }

        // Guardar nuevo producto desde el modal
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

        // Mostrar/ocultar panel del carrito
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

        // Toggle de tema oscuro para la tienda
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

        // Mostrar/ocultar sección de información adicional
        if (elements.toggleInfoBtn && elements.infoSeccion) {
            elements.toggleInfoBtn.addEventListener('click', () => {
                const isHidden = elements.infoSeccion.style.display === 'none';
                elements.infoSeccion.style.display = isHidden ? 'block' : 'none';
                elements.toggleInfoBtn.innerHTML = isHidden ? '📄 Ocultar información' : '📄 Ver más información';
                elements.toggleInfoBtn.classList.toggle('btn-info-active', isHidden);
            });
        }

        // Botón "Ver más" dinámico (dentro del grid)
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

        // Inicializar renderizado de productos
        renderProductos(productos);
    }

    // ========== PÁGINA DE VERIFICACIÓN (validation.html) ==========
    if (document.getElementById('humanForm')) {
        const form = document.getElementById("humanForm");
        const robotCheck = document.getElementById("robotCheck");
        const mathQuestion = document.getElementById("mathQuestion");
        const mathAnswer = document.getElementById("mathAnswer");
        const message = document.getElementById("message");

        // Generar pregunta aleatoria
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        let correctAnswer = num1 + num2;

        mathQuestion.textContent = `¿Cuánto es ${num1} + ${num2}?`;

        form.addEventListener("submit", function(e) {
            e.preventDefault();

            if (!robotCheck.checked) {
                message.textContent = "Debes confirmar que no eres un robot.";
                message.className = "error";
                return;
            }

            if (parseInt(mathAnswer.value) === correctAnswer) {
                message.textContent = "Registrado con éxito 🎉";
                message.className = "success";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                message.textContent = "Verificación incorrecta. Redirigiendo...";
                message.className = "error";
                setTimeout(() => {
                    window.location.href = "register.html";
                }, 2000);
            }
        });
    }

    // ========== SCRIPT PRINCIPAL (main.js) ==========
    let nombre = "Sesni ";
    console.log("Hola " + nombre);

    // ========== TOGGLE DE CONTRASEÑA (global para todas las páginas) ==========
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target;
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.textContent = '👁️‍🗨️';
                } else {
                    input.type = 'password';
                    icon.textContent = '👁️';
                }
            }
        });
    });

});