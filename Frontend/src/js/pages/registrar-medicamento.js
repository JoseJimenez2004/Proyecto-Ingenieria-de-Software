document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formMedicamento");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreMedicamento = document.getElementById("nombreMedicamento").value.trim();
    const presentacion = document.getElementById("presentacion").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const area = document.getElementById("area").value;
    const responsable = document.getElementById("responsable").value.trim();

    if (!nombreMedicamento || !cantidad) {
      alert("Por favor complete los campos obligatorios (nombre y cantidad).");
      return;
    }

    const nuevoMedicamento = {
      id_medicamento: Date.now(),
      nombre_medicamento: nombreMedicamento,
      presentacion,
      cantidad_disponible: cantidad,
      area_asignada: area,
      responsable,
      fecha_registro: new Date().toISOString().split("T")[0]
    };

    const medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];
    medicamentos.push(nuevoMedicamento);
    localStorage.setItem("medicamentos", JSON.stringify(medicamentos));

    alert(` Medicamento registrado exitosamente:
- ${nombreMedicamento} (${presentacion || "sin presentación"})
- Cantidad: ${cantidad}
- Área: ${area || "no especificada"}`);

    form.reset();
  });
});
