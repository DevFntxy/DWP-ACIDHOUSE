// login.js - Validaciones, toggle de contraseña y tema oscuro

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberCheck = document.getElementById('rememberMe');
    const themeToggle = document.getElementById('themeToggle');

    // Estado del tema para login
    let darkMode = false;

    // Función para mostrar toast
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

    function showError(input, message) {
        showToast(message, "error");
        input.classList.add("input-error");
        input.style.transform = "scale(1.02)";
        setTimeout(() => {
            input.style.transform = "scale(1)";
        }, 200);
    }

    function clearError(input) {
        input.classList.remove("input-error");
    }

    // Validación email
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

    // Validación contraseña
    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.trim() === '') {
            showError(passwordInput, '🔒 La contraseña es obligatoria');
        } else {
            clearError(passwordInput);
        }
    });

    // Cargar email recordado
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheck.checked = true;
    }

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

    // Toggle de contraseña
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target;
            const input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '👁️‍🗨️';
            } else {
                input.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });

    // Tema oscuro propio para login (opcional)
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
});