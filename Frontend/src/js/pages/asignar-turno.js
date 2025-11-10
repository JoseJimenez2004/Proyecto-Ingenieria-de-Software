document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAsignarTurno");
    const tablaTurnos = document.getElementById("tablaTurnos");
    const totalTurnosElement = document.getElementById("totalTurnos");
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

    let currentDate = new Date();
    let selectedDate = null;
    let contadorTurnos = 4;

    const horariosTurnos = {
        'matutino': '8:00 a.m. - 7:00 p.m.',
        'nocturno': '7:00 p.m. - 8:00 a.m.',
        'vespertino': '12:00 p.m. - 8:00 p.m.',
        'madrugada': '12:00 a.m. - 8:00 a.m.',
        'completo': '8:00 a.m. - 8:00 a.m.'
    };

    const avatars = {
        '1': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=45&h=45&fit=crop&crop=face',
        '2': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=45&h=45&fit=crop&crop=face',
        '3': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=45&h=45&fit=crop&crop=face',
        '4': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=45&h=45&fit=crop&crop=face',
        '5': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=45&h=45&fit=crop&crop=face',
        '6': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=45&h=45&fit=crop&crop=face',
        '7': 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=45&h=45&fit=crop&crop=face',
        '8': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=45&h=45&fit=crop&crop=face',
        '9': 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=45&h=45&fit=crop&crop=face',
        '10': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=45&h=45&fit=crop&crop=face'
    };

    const nombresEnfermeros = {
        '1': 'Lamine Yamal',
        '2': 'Esteban Trabajos',
        '3': 'Walter Blanco',
        '4': 'María González',
        '5': 'Ana Rodríguez',
        '6': 'Carlos López',
        '7': 'Laura Martínez',
        '8': 'Javier Pérez',
        '9': 'Sofía Hernández',
        '10': 'Miguel Sánchez'
    };

    const idsEnfermeros = {
        '1': 'ENF001',
        '2': 'ENF002',
        '3': 'ENF003',
        '4': 'ENF004',
        '5': 'ENF005',
        '6': 'ENF006',
        '7': 'ENF007',
        '8': 'ENF008',
        '9': 'ENF009',
        '10': 'ENF010'
    };

    let turnosAsignados = [
        {
            enfermeroId: '1',
            fecha: '2025-01-15',
            turno: 'matutino'
        },
        {
            enfermeroId: '4',
            fecha: '2025-01-15',
            turno: 'nocturno'
        },
        {
            enfermeroId: '6',
            fecha: '2025-01-16',
            turno: 'vespertino'
        }
    ];

    function actualizarContadorTurnos() {
        const total = document.querySelectorAll('#tablaTurnos tr').length;
        totalTurnosElement.textContent = `${total} turno${total !== 1 ? 's' : ''}`;
    }

    function obtenerFechasOcupadas() {
        const fechasOcupadas = new Set();
        turnosAsignados.forEach(turno => {
            fechasOcupadas.add(turno.fecha);
        });
        return fechasOcupadas;
    }

    function renderCalendar() {
        calendarDaysContainer.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const fechasOcupadas = obtenerFechasOcupadas();
        
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
            
            const isOccupied = fechasOcupadas.has(dateString);
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
            
            let className = 'calendar-day available';
            if (isOccupied) className = 'calendar-day occupied';
            if (isSelected) className = 'calendar-day selected';
            if (isToday) className += ' today';
            
            dayElement.className = className;
            dayElement.textContent = day;
            dayElement.dataset.date = dateString;
            
            if (!isOccupied) {
                dayElement.addEventListener('click', () => selectDate(date, dateString));
            }
            
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

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const enfermeroId = form.enfermero.value;
        const turnoValor = form.turno.value;
        const fechaISO = fechaInput.dataset.isoDate;

        if (!enfermeroId || !turnoValor || !fechaISO) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const fechaOcupada = turnosAsignados.some(turno => 
            turno.fecha === fechaISO && turno.enfermeroId === enfermeroId
        );

        if (fechaOcupada) {
            alert("Este enfermero ya tiene un turno asignado para esta fecha.");
            return;
        }

        const enfermeroNombre = nombresEnfermeros[enfermeroId];
        const turnoTexto = form.turno.options[form.turno.selectedIndex].text;
        const horario = horariosTurnos[turnoValor];
        const avatar = avatars[enfermeroId];
        const enfermeroIdTexto = idsEnfermeros[enfermeroId];
        const fechaFormateada = new Date(fechaISO).toLocaleDateString('es-ES');

        const nuevaFila = document.createElement("tr");
        nuevaFila.className = `turno-${turnoValor}`;
        nuevaFila.innerHTML = `
            <td>
                <div class="nurse-info">
                    <img src="${avatar}" alt="${enfermeroNombre}" class="nurse-avatar">
                    <div class="nurse-details">
                        <span class="nurse-name">${enfermeroNombre}</span>
                        <span class="nurse-id">ID: ${enfermeroIdTexto}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge turno-badge ${turnoValor}">${turnoTexto}</span></td>
            <td>${horario}</td>
            <td>${fechaFormateada}</td>
            <td><button class="btn btn-sm btn-outline-danger btn-delete"><i class="bi bi-trash"></i></button></td>
        `;
        tablaTurnos.appendChild(nuevaFila);

        turnosAsignados.push({
            enfermeroId: enfermeroId,
            fecha: fechaISO,
            turno: turnoValor
        });

        contadorTurnos++;
        actualizarContadorTurnos();
        form.reset();
        fechaInput.removeAttribute('data-iso-date');

        nuevaFila.querySelector(".btn-delete").addEventListener("click", function() {
            const fila = this.closest('tr');
            const fechaEliminar = new Date(fila.cells[3].textContent.split('/').reverse().join('-')).toISOString().split('T')[0];
            const enfermeroEliminar = enfermeroId;
            
            turnosAsignados = turnosAsignados.filter(turno => 
                !(turno.fecha === fechaEliminar && turno.enfermeroId === enfermeroEliminar)
            );
            
            fila.remove();
            actualizarContadorTurnos();
        });
    });

    btnOpenCalendar.addEventListener('click', openCalendar);
    btnCloseCalendar.addEventListener('click', closeCalendar);
    btnCancelCalendar.addEventListener('click', closeCalendar);
    btnConfirmDate.addEventListener('click', confirmDate);
    btnPrevMonth.addEventListener('click', () => cambiarMes(-1));
    btnNextMonth.addEventListener('click', () => cambiarMes(1));

    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            closeCalendar();
        }
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const fila = this.closest('tr');
            const fechaTexto = fila.cells[3].textContent;
            const fechaEliminar = new Date(fechaTexto.split('/').reverse().join('-')).toISOString().split('T')[0];
            const enfermeroNombre = fila.cells[0].querySelector('.nurse-name').textContent;
            const enfermeroEliminar = Object.keys(nombresEnfermeros).find(
                key => nombresEnfermeros[key] === enfermeroNombre
            );
            
            turnosAsignados = turnosAsignados.filter(turno => 
                !(turno.fecha === fechaEliminar && turno.enfermeroId === enfermeroEliminar)
            );
            
            fila.remove();
            actualizarContadorTurnos();
        });
    });

    actualizarContadorTurnos();
});