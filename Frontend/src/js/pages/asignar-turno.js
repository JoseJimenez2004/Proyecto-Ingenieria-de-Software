//  Asignar Turno - Para el control básico del formulario

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAsignarTurno");
    const tablaTurnos = document.getElementById("tablaTurnos");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const enfermero = form.enfermero.options[form.enfermero.selectedIndex].text;
        const turno = form.turno.options[form.turno.selectedIndex].text;
        const fecha = form.fecha.value;

        if (!enfermero || !turno || !fecha) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>—</td>
            <td>${enfermero}</td>
            <td>${turno}</td>
            <td>${fecha}</td>
            <td><button class="btn btn-sm btn-outline-danger btn-delete"><i class="bi bi-trash"></i></button></td>
        `;
        tablaTurnos.appendChild(nuevaFila);

        form.reset();

        // Eliminar fila
        nuevaFila.querySelector(".btn-delete").addEventListener("click", () => {
            nuevaFila.remove();
        });
    });
});
