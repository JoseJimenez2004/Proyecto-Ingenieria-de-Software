document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tablaActividades");
    const filtroEnfermero = document.getElementById("filtroEnfermero");
    const filtroCurso = document.getElementById("filtroCurso");
    const filtroFecha = document.getElementById("filtroFecha");
    const btnFiltrar = document.getElementById("btnFiltrar");

    // Carga la lista de cursos en el filtro
    function cargarCursos() {
        const selectCurso = document.getElementById("filtroCurso");
        const cursos = JSON.parse(localStorage.getItem("cursos")) || []; // simulando backend

        cursos.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso.nombre;
            option.textContent = curso.nombre;
            selectCurso.appendChild(option);
        });
    }

    // Simula la carga de datos desde "backend" (por mientras en localStorage)
    function cargarActividades() {
        const inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];

        if (inscripciones.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay registros disponibles</td></tr>`;
            return;
        }

        renderTabla(inscripciones);
    }

    // Renderizar tabla
    function renderTabla(data) {
        tabla.innerHTML = "";

        data.forEach(item => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
        <td>${item.enfermero}</td>
        <td>${item.curso}</td>
        <td>${item.area || "-"}</td>
        <td>${item.turno || "-"}</td>
        <td>${item.fecha}</td>
        <td><span class="badge bg-success">Completado</span></td>
      `;
            tabla.appendChild(fila);
        });
    }

    // Filtrar resultados
    function aplicarFiltros() {
        const inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
        const filtroNom = filtroEnfermero.value.toLowerCase();
        const filtroCur = filtroCurso.value.toLowerCase();
        const filtroFec = filtroFecha.value;

        const filtrados = inscripciones.filter(item => {
            const matchEnfermero = item.enfermero.toLowerCase().includes(filtroNom);
            const matchCurso = item.curso.toLowerCase().includes(filtroCur);
            const matchFecha = filtroFec ? item.fecha === filtroFec : true;
            return matchEnfermero && matchCurso && matchFecha;
        });

        renderTabla(filtrados);
    }

    btnFiltrar.addEventListener("click", aplicarFiltros);

    // Inicializar tabla
    cargarCursos();
    cargarActividades();
});
