document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formInscripcionCurso");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const curso = document.getElementById("curso").value.trim();
        const enfermero = document.getElementById("enfermero").value.trim();
        const fecha = document.getElementById("fecha").value;
        const area = document.getElementById("area").value;
        const turno = document.getElementById("turno").value;

        if (!curso || !enfermero || !fecha) {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }

        // Crea un objeto con los datos de inscripción
        const nuevaInscripcion = {
            id: Date.now(),
            curso,
            enfermero,
            fecha,
            area,
            turno
        };

        // SE guarda en localStorage (teemporal)
        const inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
        inscripciones.push(nuevaInscripcion);
        localStorage.setItem("inscripciones", JSON.stringify(inscripciones));

        alert(` Inscripción registrada correctamente:
- Curso: ${curso}
- Enfermero: ${enfermero}
- Fecha: ${fecha}`);

        form.reset();
    });
});
