// Lógica simple para añadir o editar roles (local)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRol");
    const tablaRoles = document.getElementById("tablaRoles");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nombreRol = form.nombreRol.value.trim();
        const descripcionRol = form.descripcionRol.value.trim();
        const permisos = Array.from(form.querySelectorAll("input[name='permisos']:checked"))
            .map(p => p.parentElement.textContent.trim())
            .join(", ");

        if (!nombreRol) {
            alert("El nombre del rol es obligatorio.");
            return;
        }

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>—</td>
            <td>${nombreRol}</td>
            <td>${descripcionRol || "—"}</td>
            <td>${permisos || "Sin permisos"}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-editar"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar"><i class="bi bi-trash"></i></button>
            </td>
        `;

        tablaRoles.appendChild(fila);
        form.reset();

        fila.querySelector(".btn-eliminar").addEventListener("click", () => fila.remove());
        fila.querySelector(".btn-editar").addEventListener("click", () => {
            form.nombreRol.value = fila.children[1].textContent;
            form.descripcionRol.value = fila.children[2].textContent === "—" ? "" : fila.children[2].textContent;
        });
    });
});
