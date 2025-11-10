document.addEventListener("DOMContentLoaded", () => {
    // Elementos del formulario
    const form = document.getElementById("formReportePacientes");
    const tablaPacientes = document.getElementById("tablaPacientes");
    const frecuenciaSelect = document.getElementById("frecuencia");
    const pisoSelect = document.getElementById("piso");
    const fechaInicioInput = document.getElementById("fechaInicio");
    const fechaFinInput = document.getElementById("fechaFin");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnExportExcel = document.getElementById("btnExportExcel");
    const btnExportPDF = document.getElementById("btnExportPDF");

    // Elementos de estadísticas
    const totalPacientesElement = document.getElementById("totalPacientes");
    const ocupacionPromedioElement = document.getElementById("ocupacionPromedio");
    const totalEnfermerosElement = document.getElementById("totalEnfermeros");
    const metricaPacientes = document.getElementById("metricaPacientes");
    const metricaOcupacion = document.getElementById("metricaOcupacion");
    const metricaAlerta = document.getElementById("metricaAlerta");
    const metricaRelacion = document.getElementById("metricaRelacion");

    // Elementos del calendario
    const calendarModal = document.getElementById("calendarModal");
    const modalCalendarTitle = document.getElementById("modalCalendarTitle");
    const btnOpenCalendarInicio = document.getElementById("btnOpenCalendarInicio");
    const btnOpenCalendarFin = document.getElementById("btnOpenCalendarFin");
    const btnCloseCalendar = document.querySelector(".btn-close-calendar");
    const btnCancelCalendar = document.getElementById("btnCancelCalendar");
    const btnConfirmDate = document.getElementById("btnConfirmDate");
    const btnPrevMonth = document.getElementById("btnPrevMonth");
    const btnNextMonth = document.getElementById("btnNextMonth");
    const currentMonthElement = document.getElementById("currentMonth");
    const calendarDaysContainer = document.getElementById("calendarDays");

    // Variables globales
    let currentDate = new Date();
    let selectedDate = null;
    let currentInput = null;
    let ocupacionChart = null;

    // Datos de ejemplo
    const pisosData = {
        "1": { nombre: "Piso 1", especialidad: "Pediatría", camasTotales: 40 },
        "2": { nombre: "Piso 2", especialidad: "Ginecología", camasTotales: 35 },
        "3": { nombre: "Piso 3", especialidad: "Cirugía", camasTotales: 50 },
        "4": { nombre: "Piso 4", especialidad: "Cardiología", camasTotales: 30 },
        "5": { nombre: "Piso 5", especialidad: "Ortopedia", camasTotales: 45 }
    };

    let reportesData = [
        {
            piso: "1",
            pacientes: 32,
            camasOcupadas: 32,
            enfermeros: 8,
            ocupacion: 80,
            estado: "optimo",
            relacion: "1:4"
        },
        {
            piso: "2",
            pacientes: 28,
            camasOcupadas: 28,
            enfermeros: 6,
            ocupacion: 80,
            estado: "normal",
            relacion: "1:4.7"
        },
        {
            piso: "3",
            pacientes: 42,
            camasOcupadas: 42,
            enfermeros: 9,
            ocupacion: 84,
            estado: "alerta",
            relacion: "1:4.7"
        },
        {
            piso: "4",
            pacientes: 22,
            camasOcupadas: 22,
            enfermeros: 5,
            ocupacion: 73,
            estado: "optimo",
            relacion: "1:4.4"
        },
        {
            piso: "5",
            pacientes: 35,
            camasOcupadas: 35,
            enfermeros: 7,
            ocupacion: 78,
            estado: "normal",
            relacion: "1:5"
        }
    ];

    // Inicialización
    function inicializar() {
        configurarFechas();
        renderizarReportes();
        actualizarEstadisticas();
        inicializarGrafico();
        configurarEventListeners();
    }

    function configurarFechas() {
        const hoy = new Date();
        const haceUnaSemana = new Date(hoy);
        haceUnaSemana.setDate(hoy.getDate() - 7);

        fechaInicioInput.value = formatearFecha(haceUnaSemana);
        fechaInicioInput.dataset.isoDate = haceUnaSemana.toISOString().split('T')[0];
        fechaFinInput.value = formatearFecha(hoy);
        fechaFinInput.dataset.isoDate = hoy.toISOString().split('T')[0];
    }

    function formatearFecha(fecha) {
        return fecha.toLocaleDateString('es-ES');
    }

    function configurarEventListeners() {
        form.addEventListener("submit", generarReporte);
        btnLimpiar.addEventListener("click", limpiarFiltros);
        btnActualizar.addEventListener("click", actualizarDatos);
        btnExportExcel.addEventListener("click", exportarExcel);
        btnExportPDF.addEventListener("click", exportarPDF);

        // Eventos del calendario
        btnOpenCalendarInicio.addEventListener('click', () => abrirCalendario('inicio'));
        btnOpenCalendarFin.addEventListener('click', () => abrirCalendario('fin'));
        btnCloseCalendar.addEventListener('click', cerrarCalendario);
        btnCancelCalendar.addEventListener('click', cerrarCalendario);
        btnConfirmDate.addEventListener('click', confirmarFecha);
        btnPrevMonth.addEventListener('click', () => cambiarMes(-1));
        btnNextMonth.addEventListener('click', () => cambiarMes(1));
    }

    function generarReporte(event) {
        event.preventDefault();

        const frecuencia = frecuenciaSelect.value;
        const piso = pisoSelect.value;
        const fechaInicio = fechaInicioInput.dataset.isoDate;
        const fechaFin = fechaFinInput.dataset.isoDate;

        if (!frecuencia || !piso) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        // Simular procesamiento
        simularProcesamiento().then(() => {
            renderizarReportes(piso);
            actualizarEstadisticas();
            actualizarGrafico();
            mostrarMensajeExito("Reporte generado correctamente");
        });
    }

    function simularProcesamiento() {
        return new Promise((resolve) => {
            btnActualizar.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Procesando...';
            btnActualizar.disabled = true;

            setTimeout(() => {
                // Simular cambios en los datos
                reportesData.forEach(piso => {
                    const variacion = (Math.random() - 0.5) * 4;
                    piso.pacientes = Math.max(0, Math.min(pisosData[piso.piso].camasTotales, 
                        Math.round(piso.pacientes + variacion)));
                    piso.camasOcupadas = piso.pacientes;
                    piso.ocupacion = Math.round((piso.camasOcupadas / pisosData[piso.piso].camasTotales) * 100);
                    
                    // Actualizar estado basado en ocupación
                    if (piso.ocupacion >= 85) {
                        piso.estado = "alerta";
                    } else if (piso.ocupacion >= 75) {
                        piso.estado = "normal";
                    } else {
                        piso.estado = "optimo";
                    }

                    // Actualizar relación enfermero/paciente
                    piso.relacion = `1:${(piso.pacientes / piso.enfermeros).toFixed(1)}`;
                });

                btnActualizar.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Actualizar';
                btnActualizar.disabled = false;
                resolve();
            }, 1500);
        });
    }

    function renderizarReportes(pisoFiltro = "todos") {
        tablaPacientes.innerHTML = '';

        const datosFiltrados = pisoFiltro === "todos" 
            ? reportesData 
            : reportesData.filter(piso => piso.piso === pisoFiltro);

        if (datosFiltrados.length === 0) {
            tablaPacientes.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        <i class="bi bi-inbox display-4 d-block mb-2"></i>
                        No hay datos disponibles para los filtros seleccionados
                    </td>
                </tr>
            `;
            return;
        }

        datosFiltrados.forEach(datos => {
            const pisoInfo = pisosData[datos.piso];
            const fila = document.createElement('tr');
            fila.className = `estado-${datos.estado}`;
            fila.innerHTML = `
                <td>
                    <strong>${pisoInfo.nombre}</strong>
                </td>
                <td>${pisoInfo.especialidad}</td>
                <td>
                    <span class="fw-bold">${datos.pacientes}</span>
                    <small class="text-muted d-block">de ${pisoInfo.camasTotales} camas</small>
                </td>
                <td>${datos.camasOcupadas}</td>
                <td>${datos.enfermeros}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1 me-2" style="height: 8px;">
                            <div class="progress-bar ${datos.ocupacion >= 85 ? 'bg-danger' : datos.ocupacion >= 75 ? 'bg-warning' : 'bg-success'}" 
                                 style="width: ${datos.ocupacion}%"></div>
                        </div>
                        <span class="fw-bold">${datos.ocupacion}%</span>
                    </div>
                </td>
                <td>
                    <span class="badge badge-${datos.estado}">
                        ${datos.estado === 'optimo' ? 'Óptimo' : datos.estado === 'normal' ? 'Normal' : 'Alerta'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-detalles" data-piso="${datos.piso}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info btn-grafico" data-piso="${datos.piso}">
                        <i class="bi bi-graph-up"></i>
                    </button>
                </td>
            `;
            tablaPacientes.appendChild(fila);
        });

        // Agregar event listeners a los botones
        document.querySelectorAll('.btn-detalles').forEach(btn => {
            btn.addEventListener('click', () => mostrarDetallesPiso(btn.dataset.piso));
        });

        document.querySelectorAll('.btn-grafico').forEach(btn => {
            btn.addEventListener('click', () => mostrarGraficoPiso(btn.dataset.piso));
        });
    }

    function actualizarEstadisticas() {
        const totalPacientes = reportesData.reduce((sum, piso) => sum + piso.pacientes, 0);
        const totalCamas = Object.values(pisosData).reduce((sum, piso) => sum + piso.camasTotales, 0);
        const totalEnfermeros = reportesData.reduce((sum, piso) => sum + piso.enfermeros, 0);
        const ocupacionPromedio = Math.round((totalPacientes / totalCamas) * 100);
        const alertasActivas = reportesData.filter(piso => piso.estado === "alerta").length;
        const relacionPromedio = totalPacientes > 0 ? (totalPacientes / totalEnfermeros).toFixed(1) : 0;

        // Actualizar estadísticas principales
        totalPacientesElement.textContent = totalPacientes.toLocaleString();
        ocupacionPromedioElement.textContent = `${ocupacionPromedio}%`;
        totalEnfermerosElement.textContent = totalEnfermeros;

        // Actualizar métricas en tiempo real
        metricaPacientes.textContent = totalPacientes.toLocaleString();
        metricaOcupacion.textContent = `${ocupacionPromedio}%`;
        metricaAlerta.textContent = alertasActivas;
        metricaRelacion.textContent = `1:${relacionPromedio}`;
    }

    function inicializarGrafico() {
        const ctx = document.getElementById('ocupacionChart').getContext('2d');
        
        const datos = reportesData.map(piso => ({
            piso: pisosData[piso.piso].nombre,
            ocupacion: piso.ocupacion,
            color: piso.ocupacion >= 85 ? '#e74c3c' : piso.ocupacion >= 75 ? '#f39c12' : '#2ecc71'
        }));

        ocupacionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datos.map(d => d.piso),
                datasets: [{
                    label: 'Tasa de Ocupación (%)',
                    data: datos.map(d => d.ocupacion),
                    backgroundColor: datos.map(d => d.color),
                    borderColor: datos.map(d => d.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Ocupación (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Ocupación por Piso',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    function actualizarGrafico() {
        if (!ocupacionChart) return;

        const datos = reportesData.map(piso => ({
            piso: pisosData[piso.piso].nombre,
            ocupacion: piso.ocupacion,
            color: piso.ocupacion >= 85 ? '#e74c3c' : piso.ocupacion >= 75 ? '#f39c12' : '#2ecc71'
        }));

        ocupacionChart.data.labels = datos.map(d => d.piso);
        ocupacionChart.data.datasets[0].data = datos.map(d => d.ocupacion);
        ocupacionChart.data.datasets[0].backgroundColor = datos.map(d => d.color);
        ocupacionChart.data.datasets[0].borderColor = datos.map(d => d.color);
        ocupacionChart.update();
    }

    function limpiarFiltros() {
        frecuenciaSelect.value = "";
        pisoSelect.value = "";
        configurarFechas();
        renderizarReportes();
        actualizarEstadisticas();
        mostrarMensajeInfo("Filtros limpiados correctamente");
    }

    function actualizarDatos() {
        simularProcesamiento().then(() => {
            renderizarReportes(pisoSelect.value);
            actualizarEstadisticas();
            actualizarGrafico();
            mostrarMensajeExito("Datos actualizados correctamente");
        });
    }

    function exportarExcel() {
        // Simular exportación a Excel
        mostrarMensajeExito("Exportando a Excel...");
        setTimeout(() => {
            mostrarMensajeExito("Reporte exportado a Excel correctamente");
        }, 2000);
    }

    function exportarPDF() {
        // Simular exportación a PDF
        mostrarMensajeExito("Generando PDF...");
        setTimeout(() => {
            mostrarMensajeExito("Reporte exportado a PDF correctamente");
        }, 2000);
    }

    function mostrarDetallesPiso(pisoId) {
        const datos = reportesData.find(p => p.piso === pisoId);
        const pisoInfo = pisosData[pisoId];
        
        if (datos && pisoInfo) {
            alert(`Detalles del ${pisoInfo.nombre} (${pisoInfo.especialidad}):
            
• Pacientes activos: ${datos.pacientes}
• Camas ocupadas: ${datos.camasOcupadas} de ${pisoInfo.camasTotales}
• Enfermeros asignados: ${datos.enfermeros}
• Tasa de ocupación: ${datos.ocupacion}%
• Relación enfermero/paciente: ${datos.relacion}
• Estado: ${datos.estado === 'optimo' ? 'Óptimo' : datos.estado === 'normal' ? 'Normal' : 'Alerta'}`);
        }
    }

    function mostrarGraficoPiso(pisoId) {
        const datos = reportesData.find(p => p.piso === pisoId);
        const pisoInfo = pisosData[pisoId];
        
        if (datos && pisoInfo) {
            // En una implementación real, aquí se mostraría un modal con el gráfico detallado
            alert(`Mostrando gráfico detallado para ${pisoInfo.nombre}`);
        }
    }

    // Funciones del calendario
    function renderCalendario() {
        calendarDaysContainer.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        currentMonthElement.textContent = currentDate.toLocaleDateString('es-ES', { 
            month: 'long', 
            year: 'numeric' 
        }).replace(/^\w/, c => c.toUpperCase());

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        for (let i = 0; i < startDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            dayElement.textContent = prevMonthLastDay - startDay + i + 1;
            calendarDaysContainer.appendChild(dayElement);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const date = new Date(year, month, day);
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
            
            let className = 'calendar-day available';
            if (isSelected) className = 'calendar-day selected';
            if (isToday) className += ' today';
            
            dayElement.className = className;
            dayElement.textContent = day;
            dayElement.dataset.date = dateString;
            
            dayElement.addEventListener('click', () => seleccionarFecha(date, dateString));
            
            calendarDaysContainer.appendChild(dayElement);
        }

        const totalCells = 42;
        const remainingCells = totalCells - (startDay + daysInMonth);
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = i;
            calendarDaysContainer.appendChild(dayElement);
        }
    }

    function seleccionarFecha(date, dateString) {
        selectedDate = date;
        renderCalendario();
        
        const selectedElement = document.querySelector(`[data-date="${dateString}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
    }

    function abrirCalendario(inputType) {
        currentInput = inputType;
        calendarModal.style.display = 'flex';
        selectedDate = null;
        
        if (inputType === 'inicio') {
            modalCalendarTitle.textContent = 'Seleccionar Fecha de Inicio';
        } else {
            modalCalendarTitle.textContent = 'Seleccionar Fecha de Fin';
        }
        
        renderCalendario();
    }

    function cerrarCalendario() {
        calendarModal.style.display = 'none';
    }

    function confirmarFecha() {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            const formattedDate = selectedDate.toLocaleDateString('es-ES');
            
            if (currentInput === 'inicio') {
                fechaInicioInput.value = formattedDate;
                fechaInicioInput.dataset.isoDate = dateString;
            } else {
                fechaFinInput.value = formattedDate;
                fechaFinInput.dataset.isoDate = dateString;
            }
            cerrarCalendario();
        } else {
            alert('Por favor, seleccione una fecha.');
        }
    }

    function cambiarMes(direccion) {
        currentDate.setMonth(currentDate.getMonth() + direccion);
        renderCalendario();
    }

    function mostrarMensajeExito(mensaje) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-success alert-dismissible fade show';
        alerta.innerHTML = `
            <i class="bi bi-check-circle"></i> ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.form-header').appendChild(alerta);
        
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }

    function mostrarMensajeInfo(mensaje) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-info alert-dismissible fade show';
        alerta.innerHTML = `
            <i class="bi bi-info-circle"></i> ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.form-header').appendChild(alerta);
        
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    // Inicializar la aplicación
    inicializar();
});