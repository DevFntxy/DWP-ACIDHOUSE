// login.js - Validaciones y toggle para la página de login

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberCheck = document.getElementById('rememberMe');

    // Función para mostrar toast (copiada de script.js para mantener consistencia)
    function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.className = "";
        toast.classList.add("show", type);

        setTimeout(() => {
            toast.classList.remove("show", type);
        }, 3000);
    }

    // Función para marcar error en campo
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

    // Validación en tiempo real para email
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

    // Validación en tiempo real para contraseña (solo requerida)
    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.trim() === '') {
            showError(passwordInput, '🔒 La contraseña es obligatoria');
        } else {
            clearError(passwordInput);
        }
    });

    // Cargar email recordado si existe
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

        // Validar email
        if (email === '') {
            showError(emailInput, '📧 El email es obligatorio');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, '⚠️ Formato de email inválido');
            isValid = false;
        }

        // Validar contraseña
        if (password === '') {
            showError(passwordInput, '🔒 La contraseña es obligatoria');
            isValid = false;
        }

        if (isValid) {
            // Guardar email si "Recordarme" está marcado
            if (rememberCheck.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            showToast('✅ Inicio de sesión exitoso (simulado)', 'success');
            // Aquí podrías redirigir al dashboard
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);
        }
    });

    // Toggle de visibilidad de contraseña (funciona para cualquier campo con data-target)
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target;
            const input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '👁️‍🗨️'; // o un ojo tachado
            } else {
                input.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });
});