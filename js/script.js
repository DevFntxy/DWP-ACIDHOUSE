document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const strengthFill = document.getElementById("strengthFill");
    const passwordChecklist = document.getElementById("passwordChecklist");

    // Inicializar ocultos
    passwordChecklist.style.display = "none";
    document.querySelector(".strength-bar").style.opacity = "0.3";

    // Función para mostrar toast
    function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.className = "";
        toast.classList.add("show", type);

        setTimeout(() => {
            toast.classList.remove("show", type);
        }, 3000);
    }

    // Función para mostrar error en un campo (toast + borde rojo)
    function showError(input, message) {
        showToast(message, "error");
        input.classList.add("input-error");
        
        // Pequeña animación de escala
        input.style.transform = "scale(1.02)";
        setTimeout(() => {
            input.style.transform = "scale(1)";
        }, 200);
    }

    // Función para limpiar error visual de un campo
    function clearError(input) {
        input.classList.remove("input-error");
    }

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

    // Mientras escribe email, si ya no hay error, quitar borde rojo
    emailInput.addEventListener("input", function () {
        if (emailInput.value.trim() !== "" && emailInput.classList.contains("input-error")) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(emailInput.value.trim())) {
                clearError(emailInput);
            }
        }
    });

    // Teléfono: solo números y validación de 10 dígitos
    phoneInput.addEventListener("input", function () {
        // Eliminar cualquier caracter que no sea número
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Validar longitud
        if (this.value.length > 0 && this.value.length !== 10) {
            // No mostramos toast en cada input, solo marcamos error visual
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

    // Password: mostrar checklist al enfocar
    passwordInput.addEventListener("focus", function () {
        passwordChecklist.style.display = "block";
        passwordChecklist.style.animation = "fadeIn 0.3s ease";
        document.querySelector(".strength-bar").style.opacity = "1";
    });

    // Validación de password en tiempo real (checklist y barra)
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

        // Marcar error si no cumple requisitos (solo visual, sin toast)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (value.length > 0 && !passwordRegex.test(value)) {
            passwordInput.classList.add("input-error");
        } else {
            passwordInput.classList.remove("input-error");
        }
    });

    // Al perder foco, si está vacío ocultar checklist y barra tenue
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

    // Confirmar contraseña: validar en tiempo real (solo visual, toast al enviar)
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

    // --- Validación final al enviar ---
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let isValid = true;
        let errorMessages = [];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        const phoneRegex = /^\d{10}$/;

        // Limpiar errores visuales de todos los campos
        [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(clearError);

        // Validar nombre
        const nameValue = nameInput.value.trim();
        if (nameValue === "") {
            showError(nameInput, "✏️ El nombre es obligatorio");
            errorMessages.push("Nombre");
            isValid = false;
        } else if (nameValue.length < 2) {
            showError(nameInput, "📝 El nombre debe tener al menos 2 caracteres");
            errorMessages.push("Nombre");
            isValid = false;
        }

        // Validar email
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            showError(emailInput, "📧 El email es obligatorio");
            errorMessages.push("Email");
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            showError(emailInput, "⚠️ Formato de email inválido");
            errorMessages.push("Email");
            isValid = false;
        }

        // Validar teléfono
        const phoneValue = phoneInput.value.trim();
        if (phoneValue === "") {
            showError(phoneInput, "📞 El teléfono es obligatorio");
            errorMessages.push("Teléfono");
            isValid = false;
        } else if (!phoneRegex.test(phoneValue)) {
            showError(phoneInput, "📞 El teléfono debe tener 10 dígitos");
            errorMessages.push("Teléfono");
            isValid = false;
        }

        // Validar password
        const passwordValue = passwordInput.value;
        if (passwordValue === "") {
            showError(passwordInput, "🔒 La contraseña es obligatoria");
            errorMessages.push("Contraseña");
            isValid = false;
            // Mostrar checklist para que vea requisitos
            passwordChecklist.style.display = "block";
            document.querySelector(".strength-bar").style.opacity = "1";
        } else if (!passwordRegex.test(passwordValue)) {
            showError(passwordInput, "🔒 La contraseña no cumple los requisitos");
            errorMessages.push("Contraseña");
            isValid = false;
            passwordChecklist.style.display = "block";
            document.querySelector(".strength-bar").style.opacity = "1";
        }

        // Validar confirmación de contraseña (solo si password es válido, pero aun así validamos)
        const confirmValue = confirmPasswordInput.value.trim();
        if (confirmValue === "") {
            showError(confirmPasswordInput, "🔐 Confirmar contraseña es obligatorio");
            errorMessages.push("Confirmar contraseña");
            isValid = false;
        } else if (confirmValue !== passwordValue) {
            showError(confirmPasswordInput, "🔐 Las contraseñas no coinciden");
            errorMessages.push("Confirmar contraseña");
            isValid = false;
        }

        if (isValid) {
            showToast("🎉 ¡Registro exitoso! Bienvenido a Acid House", "success");
            form.reset();
            
            // Resetear barra y checklist
            strengthFill.style.width = "0%";
            document.getElementById("length").style.color = "#d32f2f";
            document.getElementById("uppercase").style.color = "#d32f2f";
            document.getElementById("special").style.color = "#d32f2f";
            
            passwordChecklist.style.display = "none";
            document.querySelector(".strength-bar").style.opacity = "0.3";
        } else {
            // Mostrar un toast resumen si hay varios errores, pero ya cada campo mostró su toast individual
            // Opcional: mostrar un toast general
            // showToast(`❌ Errores en: ${errorMessages.join(", ")}`, "error");
        }
    });

    // Animación de escala al focus
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
});