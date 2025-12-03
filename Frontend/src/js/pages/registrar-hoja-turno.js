document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formHojaEnfermeria");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        // Validación simple
        const enfermero = document.getElementById("enfermero").value;
        const turno = document.getElementById("turno").value;
        const fecha = document.getElementById("fecha").value;

        if (!enfermero || !turno || !fecha) {
            mostrarMensaje("error", "Por favor complete los campos requeridos (*)");
            return;
        }

        // Validar signos vitales (si se ingresan)
        const tension = document.getElementById("tension").value.trim();
        const temperatura = document.getElementById("temperatura").value.trim();
        const frecuencia = document.getElementById("frecuencia").value.trim();

        if (temperatura && isNaN(parseFloat(temperatura))) {
            mostrarMensaje("error", "La temperatura debe ser un número válido");
            return;
        }

        if (frecuencia && isNaN(parseInt(frecuencia))) {
            mostrarMensaje("error", "La frecuencia cardíaca debe ser un número válido");
            return;
        }

        // Aquí puedes agregar envío al servidor o almacenamiento
        mostrarMensaje("success", "Hoja de enfermería registrada correctamente");
        form.reset();
    });

    function mostrarMensaje(tipo, mensaje) {
        let alertDiv = document.createElement("div");
        alertDiv.className = tipo === "success" ? "alert-success" : "alert-error";
        alertDiv.textContent = mensaje;

        const mainContent = document.querySelector(".main-content");
        mainContent.prepend(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});