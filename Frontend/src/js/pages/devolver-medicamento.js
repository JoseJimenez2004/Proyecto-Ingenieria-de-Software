document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDevolucion");
  const selectMedicamento = document.getElementById("medicamento");

  // Cargar lista de medicamentos desde localStorage
  function cargarMedicamentos() {
    const medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];

    if (medicamentos.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No hay medicamentos registrados";
      option.disabled = true;
      selectMedicamento.appendChild(option);
      return;
    }

    medicamentos.forEach(med => {
      const option = document.createElement("option");
      option.value = med.id_medicamento;
      option.textContent = `${med.nombre_medicamento} (${med.presentacion || "sin presentación"})`;
      selectMedicamento.appendChild(option);
    });
  }

  // Registrar devolución
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const idMedicamento = selectMedicamento.value;
    const cantidadDevuelta = parseInt(document.getElementById("cantidadDevuelta").value);
    const motivo = document.getElementById("motivo").value.trim();
    const enfermero = document.getElementById("enfermero").value.trim();

    if (!idMedicamento || !cantidadDevuelta) {
      alert("Por favor seleccione un medicamento y la cantidad a devolver.");
      return;
    }

    const medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];
    const devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];

    // Buscar medicamento y actualizar cantidad
    const med = medicamentos.find(m => m.id_medicamento == idMedicamento);
    if (!med) {
      alert("El medicamento seleccionado no existe.");
      return;
    }

    med.cantidad_disponible += cantidadDevuelta;
    localStorage.setItem("medicamentos", JSON.stringify(medicamentos));

    // Registrar movimiento de devolución
    const nuevaDevolucion = {
      id_movimiento: Date.now(),
      id_medicamento,
      nombre_medicamento: med.nombre_medicamento,
      cantidad_devuelta: cantidadDevuelta,
      motivo,
      enfermero_responsable: enfermero,
      fecha_devolucion: new Date().toISOString().split("T")[0]
    };

    devoluciones.push(nuevaDevolucion);
    localStorage.setItem("devoluciones", JSON.stringify(devoluciones));

    alert(`Devolución registrada correctamente:
- Medicamento: ${med.nombre_medicamento}
- Cantidad devuelta: ${cantidadDevuelta}`);

    form.reset();
  });

  // Inicializar
  cargarMedicamentos();
});
