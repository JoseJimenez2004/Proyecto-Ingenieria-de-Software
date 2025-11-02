// Funcionalidad Mostrar/Ocultar Contraseña

document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const form = document.getElementById("formLoginEnfermero");
    const alertBox = document.getElementById("alertContainer");

    togglePassword.addEventListener("click", function () {
        const icon = this.querySelector("i");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            icon.classList.replace("bi-eye", "bi-eye-slash");
        } else {
            passwordInput.type = "password";
            icon.classList.replace("bi-eye-slash", "bi-eye");
        }
    });

    //  Validación de formulario (solo front) 
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita envío real

        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {
            showAlert("Por favor completa todos los campos.", "danger");
            return;
        }

        // Simulación de autenticación (TEMPORAL)
        if (email === "enfermero@aliviohospital.com" && password === "1234") {
            showAlert("Inicio de sesión exitoso. Redirigiendo...", "success");
            setTimeout(() => {
                window.location.href = "rol.html";
            }, 1500);
        } else {
            showAlert("Credenciales incorrectas. Intenta de nuevo.", "danger");
        }
    });

    //  Funciones auxiliares 
    function showAlert(message, type) {
        alertBox.className = `alert alert-${type} text-center`;
        alertBox.textContent = message;
        alertBox.classList.remove("d-none");
        setTimeout(() => alertBox.classList.add("d-none"), 3000);
    }

});
