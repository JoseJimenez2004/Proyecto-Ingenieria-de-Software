document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReporte");
    const tablaReportes = document.getElementById("tablaReportes");
    const pisosGrid = document.getElementById("pisosGrid");
    const totalPisosActivosElement = document.getElementById("totalPisosActivos");
    const totalEventosHoyElement = document.getElementById("totalEventosHoy");
    const totalIncidenciasElement = document.getElementById("totalIncidencias");
    const fechaInput = document.getElementById("fecha");
    const btnOpenCalendar = document.getElementById("btnOpenCalendar");
    const calendarModal = document.getElementById("calendarModal");
    const btnCloseCalendar = document.querySelector(".btn-close-calendar");
    const btnCancelCalendar = document.getElementById("btnCancelCalendar");
    const btnConfirmDate = document.getElementById("btnConfirmDate");
    const btnPrevMonth = document.getElementById("btnPrevMonth");
    const btnNextMonth = document.getElementById("btnNextMonth");
    const currentMonthElement = document.getElementById("currentMonth");
    const calendarDaysContainer = document.getElementById("calendarDays");
    const modalDetalles = document.getElementById("modalDetalles");
    const detallesContenido = document.getElementById("detallesContenido");
    const btnCerrarDetalles = document.getElementById("btnCerrarDetalles");
    const btnCloseModal = document.querySelector(".btn-close-modal");
    const btnActualizar = document.getElementById("btnActualizar");
    const filtroPiso = document.getElementById("filtroPiso");
    const btnExportar = document.getElementById("btnExportar");

    let currentDate = new Date();
    let selectedDate = null;
    let reportesExistentes = [
        {
            id: 1,
            fecha: "2025-01-15",
            piso: "1",
            pisoNombre: "Piso 1 - Pediatría",
            turno: "matutino",
            ingresos: 12,
            egresos: 8,
            incidencias: "Fiebre alta en paciente pediátrico, requiere atención inmediata",
            observaciones: "Paciente estable después de medicación",
            estado: "urgente",
            timestamp: new Date("2025-01-15T08:30:00")
        },
        {
            id: 2,
            fecha: "2025-01-15",
            piso: "2",
            pisoNombre: "Piso 2 - Ginecología",
            turno: "vespertino",
            ingresos: 6,
            egresos: 4,
            incidencias: "Control prenatal rutinario",
            observaciones: "Todas las pacientes en condiciones estables",
            estado: "normal",
            timestamp: new Date("2025-01-15T14:15:00")
        }
    ];

    const pisosData = {
        "1": { nombre: "Piso 1", especialidad: "Pediatría", activo: true },
        "2": { nombre: "Piso 2", especialidad: "Ginecología", activo: true },
        "3": { nombre: "Piso 3", especialidad: "Cirugía", activo: false },
        "4": { nombre: "Piso 4", especialidad: "Cardiología", activo: false },
        "5": { nombre: "Piso 5", especialidad: "Ortopedia", activo: false }
    };

    // Función para renderizar el calendario
    function renderCalendar() {
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

        // Días del mes anterior
        for (let i = 0; i < startDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            dayElement.textContent = prevMonthLastDay - startDay + i + 1;
            calendarDaysContainer.appendChild(dayElement);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Días del mes actual
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
            
            dayElement.addEventListener('click', () => selectDate(date, dateString));
            
            calendarDaysContainer.appendChild(dayElement);
        }

        const totalCells = 42;
        const remainingCells = totalCells - (startDay + daysInMonth);
        
        // Días del mes siguiente
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = i;
            calendarDaysContainer.appendChild(dayElement);
        }
    }

    function selectDate(date, dateString) {
        selectedDate = date;
        renderCalendar();
        
        const selectedElement = document.querySelector(`[data-date="${dateString}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
    }

    function openCalendar() {
        calendarModal.style.display = 'flex';
        selectedDate = null;
        renderCalendar();
    }

    function closeCalendar() {
        calendarModal.style.display = 'none';
    }

    function confirmDate() {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            const formattedDate = selectedDate.toLocaleDateString('es-ES');
            fechaInput.value = formattedDate;
            fechaInput.dataset.isoDate = dateString;
            closeCalendar();
        } else {
            alert('Por favor, seleccione una fecha.');
        }
    }

    function cambiarMes(direccion) {
        currentDate.setMonth(currentDate.getMonth() + direccion);
        renderCalendar();
    }

    function actualizarEstadisticas() {
        const hoy = new Date().toISOString().split('T')[0];
        const reportesHoy = reportesExistentes.filter(reporte => reporte.fecha === hoy);
        
        totalPisosActivosElement.textContent = Object.values(pisosData).filter(piso => piso.activo).length;
        totalEventosHoyElement.textContent = reportesHoy.length;
        
        const incidenciasHoy = reportesHoy.filter(reporte => 
            reporte.incidencias && reporte.incidencias !== "Sin incidencias"
        ).length;
        totalIncidenciasElement.textContent = incidenciasHoy;
    }

    function formatearFecha(fechaISO) {
        return new Date(fechaISO).toLocaleDateString('es-ES');
    }

    function formatearHora(fecha) {
        return new Date(fecha).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    function actualizarEstadoPisos() {
        Object.keys(pisosData).forEach(pisoId => {
            const reportesPiso = reportesExistentes.filter(reporte => 
                reporte.piso === pisoId && reporte.fecha === new Date().toISOString().split('T')[0]
            );
            pisosData[pisoId].activo = reportesPiso.length > 0;
        });
    }

    function renderizarPisos() {
        pisosGrid.innerHTML = '';
        
        Object.entries(pisosData).forEach(([pisoId, pisoInfo]) => {
            const reportesPiso = reportesExistentes.filter(reporte => 
                reporte.piso === pisoId && reporte.fecha === new Date().toISOString().split('T')[0]
            );
            
            const totalIngresos = reportesPiso.reduce((sum, reporte) => sum + reporte.ingresos, 0);
            const totalEgresos = reportesPiso.reduce((sum, reporte) => sum + reporte.egresos, 0);
            const totalIncidencias = reportesPiso.filter(reporte => 
                reporte.incidencias && reporte.incidencias !== "Sin incidencias"
            ).length;
            
            const tieneUrgencias = reportesPiso.some(reporte => reporte.estado === "urgente");
            
            const pisoCard = document.createElement('div');
            pisoCard.className = `piso-card ${pisoInfo.activo ? (tieneUrgencias ? 'urgente' : 'active') : 'inactivo'}`;
            pisoCard.dataset.piso = pisoId;
            pisoCard.innerHTML = `
                <div class="piso-header">
                    <div class="piso-info">
                        <h5>${pisoInfo.nombre}</h5>
                        <span class="piso-especialidad">${pisoInfo.especialidad}</span>
                    </div>
                    <div class="piso-status ${pisoInfo.activo ? 'active' : 'inactivo'}">
                        <i class="bi bi-circle-fill"></i>
                        ${pisoInfo.activo ? 'Activo' : 'Sin reporte'}
                    </div>
                </div>
                <div class="piso-stats">
                    <div class="stat">
                        <span class="stat-value">${totalIngresos}</span>
                        <span class="stat-label">Ingresos</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${totalEgresos}</span>
                        <span class="stat-label">Egresos</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${totalIncidencias}</span>
                        <span class="stat-label">Incidencias</span>
                    </div>
                </div>
                <div class="piso-events">
                    ${pisoInfo.activo ? (
                        tieneUrgencias ? 
                        '<span class="event-tag urgente">Urgente</span>' :
                        '<span class="event-tag rutina">Rutina</span>'
                    ) : '<span class="event-tag vacio">Sin eventos</span>'}
                </div>
            `;
            
            pisosGrid.appendChild(pisoCard);
            
            if (pisoInfo.activo) {
                pisoCard.addEventListener('click', () => {
                    filtrarPorPiso(pisoId);
                    pisoCard.classList.add('highlight');
                    setTimeout(() => pisoCard.classList.remove('highlight'), 2000);
                });
            }
        });
    }

    function renderizarReportes() {
        const pisoFiltro = filtroPiso.value;
        let reportesFiltrados = reportesExistentes;
        
        if (pisoFiltro) {
            reportesFiltrados = reportesExistentes.filter(reporte => reporte.piso === pisoFiltro);
        }
        
        reportesFiltrados.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        tablaReportes.innerHTML = '';
        
        reportesFiltrados.forEach(reporte => {
            const fila = document.createElement('tr');
            fila.className = `reporte-${reporte.estado}`;
            fila.innerHTML = `
                <td>${formatearFecha(reporte.fecha)}</td>
                <td>
                    <div class="piso-info-tabla">
                        <strong>${reporte.pisoNombre.split(' - ')[0]}</strong>
                        <small>${reporte.pisoNombre.split(' - ')[1]}</small>
                    </div>
                </td>
                <td><span class="badge turno-${reporte.turno}">${reporte.turno.charAt(0).toUpperCase() + reporte.turno.slice(1)}</span></td>
                <td>${reporte.ingresos}</td>
                <td>${reporte.egresos}</td>
                <td>${reporte.incidencias.length > 50 ? reporte.incidencias.substring(0, 50) + '...' : reporte.incidencias}</td>
                <td><span class="badge estado-${reporte.estado}">${reporte.estado.charAt(0).toUpperCase() + reporte.estado.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-detalles" data-id="${reporte.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${reporte.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            tablaReportes.appendChild(fila);
        });
        
        document.querySelectorAll('.btn-detalles').forEach(btn => {
            btn.addEventListener('click', () => {
                mostrarDetallesReporte(parseInt(btn.dataset.id));
            });
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
                eliminarReporte(parseInt(btn.dataset.id));
            });
        });
        
        actualizarEstadisticas();
    }

    function mostrarDetallesReporte(reporteId) {
        const reporte = reportesExistentes.find(r => r.id === reporteId);
        if (!reporte) return;
        
        detallesContenido.innerHTML = `
            <div class="detalles-reporte">
                <div class="detalles-header">
                    <h4>${reporte.pisoNombre}</h4>
                    <div class="detalles-meta">
                        <span class="badge turno-${reporte.turno}">${reporte.turno.charAt(0).toUpperCase() + reporte.turno.slice(1)}</span>
                        <span class="badge estado-${reporte.estado}">${reporte.estado.charAt(0).toUpperCase() + reporte.estado.slice(1)}</span>
                    </div>
                </div>
                
                <div class="detalles-fecha">
                    <strong>Fecha:</strong> ${formatearFecha(reporte.fecha)} a las ${formatearHora(reporte.timestamp)}
                </div>
                
                <div class="detalles-stats">
                    <div class="stat-detalle">
                        <i class="bi bi-door-open"></i>
                        <span>${reporte.ingresos} Ingresos</span>
                    </div>
                    <div class="stat-detalle">
                        <i class="bi bi-door-closed"></i>
                        <span>${reporte.egresos} Egresos</span>
                    </div>
                </div>
                
                <div class="detalles-incidencias">
                    <h6><i class="bi bi-exclamation-triangle"></i> Incidencias</h6>
                    <p>${reporte.incidencias}</p>
                </div>
                
                <div class="detalles-observaciones">
                    <h6><i class="bi bi-chat-text"></i> Observaciones</h6>
                    <p>${reporte.observaciones}</p>
                </div>
            </div>
        `;
        
        modalDetalles.style.display = 'flex';
    }

    function eliminarReporte(reporteId) {
        if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
            reportesExistentes = reportesExistentes.filter(r => r.id !== reporteId);
            actualizarEstadoPisos();
            renderizarPisos();
            renderizarReportes();
        }
    }

    function filtrarPorPiso(pisoId) {
        filtroPiso.value = pisoId;
        renderizarReportes();
    }

    function simularActualizacion() {
        btnActualizar.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Actualizando...';
        btnActualizar.disabled = true;
        
        setTimeout(() => {
            const nuevosReportes = Math.floor(Math.random() * 3);
            if (nuevosReportes > 0) {
                for (let i = 0; i < nuevosReportes; i++) {
                    const pisoAleatorio = Math.floor(Math.random() * 5) + 1;
                    const nuevoReporte = {
                        id: Math.max(...reportesExistentes.map(r => r.id), 0) + 1,
                        fecha: new Date().toISOString().split('T')[0],
                        piso: pisoAleatorio.toString(),
                        pisoNombre: `Piso ${pisoAleatorio} - ${pisosData[pisoAleatorio].especialidad}`,
                        turno: ['matutino', 'vespertino', 'nocturno'][Math.floor(Math.random() * 3)],
                        ingresos: Math.floor(Math.random() * 10) + 1,
                        egresos: Math.floor(Math.random() * 8) + 1,
                        incidencias: Math.random() > 0.7 ? "Nueva incidencia reportada" : "Sin incidencias",
                        observaciones: "Reporte automático del sistema",
                        estado: Math.random() > 0.8 ? "urgente" : "normal",
                        timestamp: new Date()
                    };
                    reportesExistentes.push(nuevoReporte);
                }
                
                actualizarEstadoPisos();
                renderizarPisos();
                renderizarReportes();
                
                mostrarMensajeExito(`${nuevosReportes} nuevo(s) reporte(s) encontrado(s)`);
            } else {
                mostrarMensajeInfo('No hay nuevos reportes');
            }
            
            btnActualizar.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Actualizar';
            btnActualizar.disabled = false;
        }, 2000);
    }

    function exportarReportes() {
        const pisoFiltro = filtroPiso.value;
        let reportesExportar = reportesExistentes;
        
        if (pisoFiltro) {
            reportesExportar = reportesExistentes.filter(reporte => reporte.piso === pisoFiltro);
        }
        
        if (reportesExportar.length === 0) {
            alert('No hay reportes para exportar.');
            return;
        }
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Fecha,Piso,Especialidad,Turno,Ingresos,Egresos,Incidencias,Estado\n"
            + reportesExportar.map(reporte => 
                `"${formatearFecha(reporte.fecha)}","${reporte.pisoNombre}","${reporte.turno}","${reporte.ingresos}","${reporte.egresos}","${reporte.incidencias}","${reporte.estado}"`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reportes_piso_${pisoFiltro || 'todos'}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        mostrarMensajeExito('Reportes exportados correctamente');
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

    // Event Listeners
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const fechaISO = fechaInput.dataset.isoDate || new Date().toISOString().split('T')[0];
        const piso = form.piso.value;
        const pisoNombre = form.piso.options[form.piso.selectedIndex].text;
        const turno = form.turno.value || 'matutino';
        const ingresos = parseInt(form.ingresos.value) || 0;
        const egresos = parseInt(form.egresos.value) || 0;
        const incidencias = form.incidencias.value.trim() || "Sin incidencias";
        const observaciones = form.observaciones.value.trim() || "Sin observaciones";
        
        const estado = incidencias !== "Sin incidencias" && incidencias.length > 0 ? "urgente" : "normal";

        if (!piso) {
            alert("Por favor, seleccione un piso.");
            return;
        }

        const nuevoReporte = {
            id: Math.max(...reportesExistentes.map(r => r.id), 0) + 1,
            fecha: fechaISO,
            piso: piso,
            pisoNombre: pisoNombre,
            turno: turno,
            ingresos: ingresos,
            egresos: egresos,
            incidencias: incidencias,
            observaciones: observaciones,
            estado: estado,
            timestamp: new Date()
        };

        reportesExistentes.push(nuevoReporte);
        
        actualizarEstadoPisos();
        renderizarPisos();
        renderizarReportes();
        form.reset();
        
        fechaInput.removeAttribute('data-iso-date');
        
        mostrarMensajeExito('Reporte registrado correctamente');
    });

    btnOpenCalendar.addEventListener('click', openCalendar);
    btnCloseCalendar.addEventListener('click', closeCalendar);
    btnCancelCalendar.addEventListener('click', closeCalendar);
    btnConfirmDate.addEventListener('click', confirmDate);
    btnPrevMonth.addEventListener('click', () => cambiarMes(-1));
    btnNextMonth.addEventListener('click', () => cambiarMes(1));
    btnCerrarDetalles.addEventListener('click', () => modalDetalles.style.display = 'none');
    btnCloseModal.addEventListener('click', () => modalDetalles.style.display = 'none');
    btnActualizar.addEventListener('click', simularActualizacion);
    btnExportar.addEventListener('click', exportarReportes);
    filtroPiso.addEventListener('change', renderizarReportes);

    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            closeCalendar();
        }
    });

    modalDetalles.addEventListener('click', (e) => {
        if (e.target === modalDetalles) {
            modalDetalles.style.display = 'none';
        }
    });

    // Inicialización
    fechaInput.value = new Date().toLocaleDateString('es-ES');
    fechaInput.dataset.isoDate = new Date().toISOString().split('T')[0];

    actualizarEstadoPisos();
    renderizarPisos();
    renderizarReportes();
});