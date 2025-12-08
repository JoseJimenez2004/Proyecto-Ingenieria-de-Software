(() => {
    const form = document.getElementById("incidenteForm");
    const fechaHora = document.getElementById("fechaHora");
    const ubicacion = document.getElementById("ubicacion");
    const tipo = document.getElementById("tipo");
    const otroTexto = document.getElementById("otroTexto");

    const gravedad = document.getElementById("gravedad");
    const reportante = document.getElementById("reportante");
    const encargado = document.getElementById("Encargado");
    const descripcion = document.getElementById("descripcion");

    const tablaBody = document.getElementById("tablaBody");
    const contadorIncidentes = document.getElementById("contadorIncidentes");

    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const clearStorageBtn = document.getElementById("clearStorageBtn");
    const limpiarBtn = document.getElementById("limpiarBtn");

    // Modal reportes
    const modal = document.getElementById("modalIncidente");
    const modalTitulo = document.getElementById("modalIncidenteTitulo");
    const modalBody = document.getElementById("modalIncidenteBody");
    const cerrar1 = document.getElementById("cerrarModalIncidente");
    const cerrar2 = document.getElementById("cerrarModalIncidente2");
    const toggleEstadoBtn = document.getElementById("toggleEstadoBtn");
    const eliminarIncidenteBtn = document.getElementById("eliminarIncidenteBtn");

    let incidentes = [];

    // Ejemplos para probar fronted
    const ejemplos = [
        {
            id: Date.now() + 1,
            fechaHora: "2025-01-10T08:30",
            ubicacion: "Urgencias",
            tipo: "Caída",
            gravedad: "Medio",
            reportante: "Laura Gómez",
            encargado: "Dr. Ruiz",
            descripcion: "Paciente se resbaló al intentar levantarse.",
            estado: "Sin resolver"
        },
        {
            id: Date.now() + 2,
            fechaHora: "2025-01-12T14:15",
            ubicacion: "Piso 2 - Cuarto 204",
            tipo: "Error de medicación",
            gravedad: "Alto",
            reportante: "Carlos Herrera",
            encargado: "Dra. Sánchez",
            descripcion: "Se administró medicamento erróneo. Se corrigió a tiempo.",
            estado: "Sin resolver"
        },
        {
            id: Date.now() + 3,
            fechaHora: "2025-01-14T19:50",
            ubicacion: "Laboratorio",
            tipo: "Falla de equipo",
            gravedad: "Crítico",
            reportante: "Silvia Pardo",
            encargado: "Dr. Méndez",
            descripcion: "El analizador de sangre dejó de funcionar a mitad de proceso.",
            estado: "Resuelto"
        }
    ];

    // Cargar ejemplos solo si no hay nada guardado
    if (!localStorage.getItem("incidentes")) {
        incidentes = [...ejemplos];
        localStorage.setItem("incidentes", JSON.stringify(incidentes));
    } else {
        incidentes = JSON.parse(localStorage.getItem("incidentes"));
    }

    // Funcion para mostrar campo otro en tipo de incidente
    tipo.addEventListener("change", () => {
        if (tipo.value === "otro") {
            otroTexto.classList.remove("oculto");
            otroTexto.setAttribute("required", true);
        } else {
            otroTexto.classList.add("oculto");
            otroTexto.removeAttribute("required");
            otroTexto.value = "";
        }
    });

    // Registrar incidente
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const tipoFinal = tipo.value === "otro" ? otroTexto.value : tipo.value;

        const nuevo = {
            id: Date.now(),
            fechaHora: fechaHora.value,
            ubicacion: ubicacion.value,
            tipo: tipoFinal || "Otro",
            gravedad: gravedad.value,
            reportante: reportante.value,
            encargado: encargado.value,
            descripcion: descripcion.value,
            estado: "Abierto"
        };

        incidentes.push(nuevo);
        localStorage.setItem("incidentes", JSON.stringify(incidentes));

        form.reset();
        otroTexto.classList.add("oculto");

        mostrarTabla();
    });

    // Limpiar formulario
    limpiarBtn.addEventListener("click", () => form.reset());

    // Mostrar tabla
    function mostrarTabla() {
        tablaBody.innerHTML = "";

        incidentes.forEach((i, index) => {
            const badgeClass =
                i.gravedad === "Bajo" ? "badge-bajo" :
                i.gravedad === "Medio" ? "badge-medio" :
                i.gravedad === "Alto" ? "badge-alto" :
                "badge-critico";

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${i.fechaHora.replace("T", " ")}</td>
                    <td>${i.ubicacion}</td>
                    <td>${i.tipo}</td>
                    <td><span class="badge-gravedad ${badgeClass}">${i.gravedad}</span></td>
                    <td>${i.reportante}</td>
                    <td class="${i.estado === "Resuelto" ? "estado-resuelto" : "estado-abierto"}">${i.estado}</td>
                    <td>
                        <button class="btn btn-ssm btn-primary opcionesbtn" data-id="${i.id}">
                            Opciónes
                        </button>
                    </td>
                </tr>
            `;
            tablaBody.insertAdjacentHTML("beforeend", row);
        });

        contadorIncidentes.textContent = incidentes.length;

        document.querySelectorAll(".opcionesbtn").forEach(btn => {
            btn.addEventListener("click", abrirModal);
        });
    }

    // MODAL
    let incidenteSeleccionado = null;

    function abrirModal(e) {
        const id = Number(e.target.dataset.id);
        incidenteSeleccionado = incidentes.find(i => i.id === id);

        modalTitulo.textContent = "Incidente #" + id;

        // Actualiza el texto y color del botón según el estado
        if (incidenteSeleccionado.estado === "Resuelto") {
        toggleEstadoBtn.textContent = "Marcar como ABIERTO";
        toggleEstadoBtn.className = "btn btn-warning";
        } else {
        toggleEstadoBtn.textContent = "Marcar como RESUELTO";
        toggleEstadoBtn.className = "btn btn-success";
        }
        
        modalBody.innerHTML = `
            <p><strong>Fecha:</strong> ${incidenteSeleccionado.fechaHora.replace("T"," ")}</p>
            <p><strong>Ubicación:</strong> ${incidenteSeleccionado.ubicacion}</p>
            <p><strong>Tipo:</strong> ${incidenteSeleccionado.tipo}</p>
            <p><strong>Gravedad:</strong> ${incidenteSeleccionado.gravedad}</p>
            <p><strong>Reportante:</strong> ${incidenteSeleccionado.reportante}</p>
            <p><strong>Encargado:</strong> ${incidenteSeleccionado.encargado}</p>
            <p><strong>Descripción:</strong><br>${incidenteSeleccionado.descripcion}</p>
            <p><strong>Estado:</strong> ${incidenteSeleccionado.estado}</p>
        `;

        modal.style.display = "flex";
    }

    cerrar1.addEventListener("click", () => modal.style.display = "none");
    cerrar2.addEventListener("click", () => modal.style.display = "none");

  //Logica del boton cambiar estado
    toggleEstadoBtn.addEventListener("click", () => {
    if (!incidenteSeleccionado) return;

    // Alternar
    incidenteSeleccionado.estado =
        incidenteSeleccionado.estado === "Resuelto"
        ? "Abierto"
        : "Resuelto";

    localStorage.setItem("incidentes", JSON.stringify(incidentes));
    mostrarTabla();
   // Actualizar la UI del botón sin cerrar el modal
    if (incidenteSeleccionado.estado === "Resuelto") {
        toggleEstadoBtn.textContent = "Marcar como ABIERTO";
        toggleEstadoBtn.className = "btn btn-warning";
    } else {
        toggleEstadoBtn.textContent = "Marcar como RESUELTO";
        toggleEstadoBtn.className = "btn btn-success";
    }

    //Actualiza el texto del estado dentro del modal
    abrirModal({ target: { dataset: { id: incidenteSeleccionado.id } } });
});

    // Boton Eliminar incidente
    eliminarIncidenteBtn.addEventListener("click", () => {
        if (!incidenteSeleccionado) return;

        incidentes = incidentes.filter(i => i.id !== incidenteSeleccionado.id);
        localStorage.setItem("incidentes", JSON.stringify(incidentes));

        mostrarTabla();
        modal.style.display = "none";
    });

    // Exportar pdf
    exportPdfBtn.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const img = new Image();
        img.src = "/Frontend/src/assets/img/icons/logo.png";
        
        img.onload = () => {
            doc.addImage(img, "PNG", 14, 5, 30, 30);

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 80);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Incidentes - AlivioHospital", 110, 15, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });
        
        const filas = incidentes.map(i => ([
            i.fechaHora.replace("T", " "),
            i.ubicacion,
            i.tipo,
            i.gravedad,
            i.reportante,
            i.estado
        ]));

        doc.autoTable({
            head: [["Fecha", "Ubicación", "Tipo", "Gravedad", "Reportante", "Estado"]],
            body: filas,
            startY: 40,
        });

        doc.save("incidentes.pdf");
      };
    });

    // Boton borrar todo
    clearStorageBtn.addEventListener("click", () => {
        localStorage.removeItem("incidentes");
        incidentes = [];
        mostrarTabla();
    });

    mostrarTabla();

})();
