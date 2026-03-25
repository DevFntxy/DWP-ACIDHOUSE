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