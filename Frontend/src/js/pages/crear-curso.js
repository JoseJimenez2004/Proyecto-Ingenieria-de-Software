// Simulación del registro de cursos sin backend
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCurso");
    const tablaCursos = document.getElementById("tablaCursos");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nombre = form.nombreCurso.value.trim();
        const instructor = form.instructor.value.trim();
        const modalidad = form.modalidad.value;
        const inicio = form.fechaInicio.value;
        const fin = form.fechaFin.value;

        if (!nombre || !instructor || !modalidad || !inicio || !fin) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>—</td>
            <td>${nombre}</td>
            <td>${instructor}</td>
            <td>${modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}</td>
            <td>${inicio} / ${fin}</td>
            <td><button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></td>
        `;

        tablaCursos.appendChild(nuevaFila);
        form.reset();

        nuevaFila.querySelector(".btn-outline-danger").addEventListener("click", () => {
            nuevaFila.remove();
        });
    });
});
