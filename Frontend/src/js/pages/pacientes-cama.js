const camasContainer = document.getElementById("camasContainer");
const Contadorcamas= document.getElementById("Contadorcamas");

//Modal de las camas
const modal = document.getElementById("modalCama");
const cerrarModal = document.getElementById("cerrarModal");
const modalTitulo = document.getElementById("modalTitulo");
const modalInfo = document.getElementById("modalInfo");

const pacientes = [
    { numero: 1, estado: "ocupada", paciente: { nombre: "Juan Pérez", edad: 45, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 2, estado: "disponible", paciente: null },
    { numero: 3, estado: "ocupada", paciente: { nombre: "Carlos Ruiz", edad: 50, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 4, estado: "disponible", paciente: null },
    { numero: 5, estado: "ocupada", paciente: { nombre: "Ana Torres", edad: 27, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 6, estado: "disponible", paciente: null },
    { numero: 7, estado: "disponible", paciente: null },
    { numero: 8, estado: "ocupada", paciente: { nombre: "Luis Martínez", edad: 34, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 9, estado: "disponible", paciente: null },
    { numero: 10, estado: "ocupada", paciente: { nombre: "María López", edad: 60, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 11, estado: "disponible", paciente: null },
    { numero: 12, estado: "ocupada", paciente: { nombre: "Elena Vega", edad: 41, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 13, estado: "disponible", paciente: null },
    { numero: 14, estado: "disponible", paciente: null },
    { numero: 15, estado: "ocupada", paciente: { nombre: "Julio Cruz", edad: 19, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 16, estado: "ocupada", paciente: { nombre: "María López", edad: 48, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 17, estado: "ocupada", paciente: { nombre: "Elena Vega", edad: 60, diagnostico:"Cancer", riesgo: "alto" } },
    { numero: 18, estado: "disponible", paciente: null },
];
    //contador de camas
    Contadorcamas.innerText = pacientes.length + " camas";
    
    //visualizacion de camas
    pacientes.forEach(cama => {
    const camaDiv = document.createElement("div");
    camaDiv.classList.add("cama", cama.estado); // disponible / ocupada

    let info = cama.estado === "ocupada"
    ? `${cama.paciente.nombre} (Edad: ${cama.paciente.edad})`
    : "Disponible";

    camaDiv.innerHTML = `
        <img src="/Frontend/src/assets/img/icons/Cama.jpg" alt="Cama">

        <div class="overlay"></div>

        <div class="cama-info">
            <strong>Cama ${cama.numero}</strong><br>
            ${info}
        </div>
    `;

    //abre camas al hacer click
    camaDiv.addEventListener("click", () => {
        modal.style.display = "flex";
        modalTitulo.textContent = `Cama ${cama.numero}`;

        if (cama.estado === "ocupada") {
            modalInfo.innerHTML = `
                <strong>Paciente:</strong> ${cama.paciente.nombre}<br>
                <strong>Edad:</strong> ${cama.paciente.edad}<br>
                <strong>Diagnóstico:</strong> ${cama.paciente.diagnostico}<br>
                <strong>Riesgo</strong> ${cama.paciente.riesgo}
            `;
        } else {
            modalInfo.textContent = "Cama disponible.";
        }
    });

    camasContainer.appendChild(camaDiv);
});

// CERRAR MODAL
cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cerrar al hacer click fuera
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

