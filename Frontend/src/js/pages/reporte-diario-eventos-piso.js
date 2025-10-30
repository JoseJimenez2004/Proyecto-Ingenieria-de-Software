// Simulación del registro de reportes

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReporte");
    const tablaReportes = document.getElementById("tablaReportes");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const fecha = form.fecha.value;
        const piso = form.piso.options[form.piso.selectedIndex].text;
        const ingresos = form.ingresos.value || 0;
        const egresos = form.egresos.value || 0;
        const incidencias = form.incidencias.value.trim() || "Sin incidencias";
        const observaciones = form.observaciones.value.trim() || "—";

        if (!fecha || !piso) {
            alert("Por favor, complete los campos obligatorios.");
            return;
        }

        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>—</td>
            <td>${fecha}</td>
            <td>${piso}</td>
            <td>${ingresos}</td>
            <td>${egresos}</td>
            <td>${incidencias}</td>
            <td>${observaciones}</td>
            <td><button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button></td>
        `;

        tablaReportes.appendChild(nuevaFila);
        form.reset();

        nuevaFila.querySelector(".btn-outline-danger").addEventListener("click", () => {
            nuevaFila.remove();
        });
    });
});
