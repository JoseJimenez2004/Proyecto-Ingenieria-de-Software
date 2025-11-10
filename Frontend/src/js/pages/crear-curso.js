document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCurso");
    const tablaCursos = document.getElementById("tablaCursos");
    const totalCursosElement = document.getElementById("totalCursos");
    const fechaInicioInput = document.getElementById("fechaInicio");
    const fechaFinInput = document.getElementById("fechaFin");
    const btnOpenCalendarInicio = document.getElementById("btnOpenCalendarInicio");
    const btnOpenCalendarFin = document.getElementById("btnOpenCalendarFin");
    const calendarModal = document.getElementById("calendarModal");
    const modalCalendarTitle = document.getElementById("modalCalendarTitle");
    const btnCloseCalendar = document.querySelector(".btn-close-calendar");
    const btnCancelCalendar = document.getElementById("btnCancelCalendar");
    const btnConfirmDate = document.getElementById("btnConfirmDate");
    const btnPrevMonth = document.getElementById("btnPrevMonth");
    const btnNextMonth = document.getElementById("btnNextMonth");
    const currentMonthElement = document.getElementById("currentMonth");
    const calendarDaysContainer = document.getElementById("calendarDays");
    const fileUploadArea = document.getElementById("fileUploadArea");
    const fileInput = document.getElementById("material");
    const fileList = document.getElementById("fileList");
    const materialModal = document.getElementById("materialModal");
    const materialList = document.getElementById("materialList");
    const btnCloseMaterial = document.querySelector(".btn-close-material");
    const btnCloseMaterialFooter = document.getElementById("btnCloseMaterial");

    let currentDate = new Date();
    let selectedDate = null;
    let currentInput = null;
    let uploadedFiles = [];
    let cursosRegistrados = [
        {
            nombre: "Actualización en Cuidados Intensivos",
            instructor: "Dr. Roberto Mendoza",
            modalidad: "presencial",
            duracion: "40 horas",
            fechaInicio: "2025-01-15",
            fechaFin: "2025-01-20",
            descripcion: "Curso avanzado para enfermería especializada",
            material: [
                { nombre: "Manual Cuidados Intensivos.pdf", tamaño: "2.4 MB", tipo: "pdf" },
                { nombre: "Presentación Curso.ppt", tamaño: "5.1 MB", tipo: "ppt" },
                { nombre: "Casos Prácticos.docx", tamaño: "1.2 MB", tipo: "doc" }
            ]
        },
        {
            nombre: "Primeros Auxilios Avanzados",
            instructor: "Dra. Ana López",
            modalidad: "virtual",
            duracion: "24 horas",
            fechaInicio: "2025-01-22",
            fechaFin: "2025-01-25",
            descripcion: "Técnicas de emergencia y RCP",
            material: [
                { nombre: "Guía Primeros Auxilios.pdf", tamaño: "3.2 MB", tipo: "pdf" },
                { nombre: "Video Demostración.mp4", tamaño: "15.7 MB", tipo: "video" }
            ]
        }
    ];

    function actualizarContadorCursos() {
        const total = document.querySelectorAll('#tablaCursos tr').length;
        totalCursosElement.textContent = `${total} curso${total !== 1 ? 's' : ''}`;
    }

    function formatearFecha(fechaISO) {
        return new Date(fechaISO).toLocaleDateString('es-ES');
    }

    function obtenerIconoArchivo(tipo) {
        const iconos = {
            'pdf': 'bi-file-earmark-pdf',
            'doc': 'bi-file-earmark-word',
            'docx': 'bi-file-earmark-word',
            'ppt': 'bi-file-earmark-ppt',
            'pptx': 'bi-file-earmark-ppt',
            'jpg': 'bi-file-image',
            'png': 'bi-file-image',
            'video': 'bi-file-play',
            'default': 'bi-file-earmark'
        };
        return iconos[tipo] || iconos.default;
    }

    function formatearTamaño(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

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
            
            dayElement.addEventListener('click', () => selectDate(date, dateString));
            
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

    function openCalendar(inputType) {
        currentInput = inputType;
        calendarModal.style.display = 'flex';
        selectedDate = null;
        
        if (inputType === 'inicio') {
            modalCalendarTitle.textContent = 'Seleccionar Fecha de Inicio';
        } else {
            modalCalendarTitle.textContent = 'Seleccionar Fecha de Fin';
        }
        
        renderCalendar();
    }

    function closeCalendar() {
        calendarModal.style.display = 'none';
    }

    function confirmDate() {
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
            closeCalendar();
        } else {
            alert('Por favor, seleccione una fecha.');
        }
    }

    function cambiarMes(direccion) {
        currentDate.setMonth(currentDate.getMonth() + direccion);
        renderCalendar();
    }

    function manejarSubidaArchivos(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            const fileType = file.name.split('.').pop().toLowerCase();
            const fileSize = formatearTamaño(file.size);
            
            uploadedFiles.push({
                file: file,
                nombre: file.name,
                tamaño: fileSize,
                tipo: fileType
            });
        });
        
        actualizarListaArchivos();
    }

    function actualizarListaArchivos() {
        fileList.innerHTML = '';
        
        uploadedFiles.forEach((fileInfo, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="bi ${obtenerIconoArchivo(fileInfo.tipo)} file-icon"></i>
                    <div class="file-details">
                        <span class="file-name">${fileInfo.nombre}</span>
                        <span class="file-size">${fileInfo.tamaño}</span>
                    </div>
                </div>
                <button type="button" class="btn-remove-file" data-index="${index}">
                    <i class="bi bi-x-circle"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });

        document.querySelectorAll('.btn-remove-file').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                uploadedFiles.splice(index, 1);
                actualizarListaArchivos();
            });
        });
    }

    function mostrarMaterialCurso(material) {
        materialList.innerHTML = '';
        
        if (material.length === 0) {
            materialList.innerHTML = '<p class="text-center text-muted">No hay material disponible para este curso.</p>';
        } else {
            material.forEach(archivo => {
                const materialItem = document.createElement('div');
                materialItem.className = 'material-item';
                materialItem.innerHTML = `
                    <i class="bi ${obtenerIconoArchivo(archivo.tipo)} material-icon"></i>
                    <div class="material-details">
                        <div class="material-name">${archivo.nombre}</div>
                        <div class="material-info">${archivo.tamaño} • ${archivo.tipo.toUpperCase()}</div>
                    </div>
                `;
                materialList.appendChild(materialItem);
            });
        }
        
        materialModal.style.display = 'flex';
    }

    function cerrarMaterialModal() {
        materialModal.style.display = 'none';
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nombre = form.nombreCurso.value.trim();
        const instructor = form.instructor.value.trim();
        const modalidad = form.modalidad.value;
        const fechaInicioISO = fechaInicioInput.dataset.isoDate;
        const fechaFinISO = fechaFinInput.dataset.isoDate;
        const duracion = form.duracion.value;
        const descripcion = form.descripcion.value.trim();

        if (!nombre || !instructor || !modalidad || !fechaInicioISO || !fechaFinISO) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        if (new Date(fechaInicioISO) > new Date(fechaFinISO)) {
            alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
            return;
        }

        const nuevoCurso = {
            nombre: nombre,
            instructor: instructor,
            modalidad: modalidad,
            duracion: duracion ? `${duracion} horas` : 'No especificada',
            fechaInicio: fechaInicioISO,
            fechaFin: fechaFinISO,
            descripcion: descripcion || 'Sin descripción',
            material: uploadedFiles.map(file => ({
                nombre: file.nombre,
                tamaño: file.tamaño,
                tipo: file.tipo
            }))
        };

        cursosRegistrados.push(nuevoCurso);

        const nuevaFila = document.createElement("tr");
        nuevaFila.className = `curso-${modalidad}`;
        nuevaFila.innerHTML = `
            <td>
                <div class="curso-info">
                    <strong>${nombre}</strong>
                    <small class="text-muted">${descripcion || 'Sin descripción'}</small>
                </div>
            </td>
            <td>${instructor}</td>
            <td><span class="badge modalidad-badge ${modalidad}">${modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}</span></td>
            <td>${duracion ? `${duracion} horas` : 'No especificada'}</td>
            <td>${formatearFecha(fechaInicioISO)} - ${formatearFecha(fechaFinISO)}</td>
            <td>
                <button class="btn btn-sm btn-outline-info btn-material">
                    <i class="bi bi-folder"></i> ${uploadedFiles.length} archivo${uploadedFiles.length !== 1 ? 's' : ''}
                </button>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger btn-delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tablaCursos.appendChild(nuevaFila);

        nuevaFila.querySelector(".btn-material").addEventListener("click", () => {
            mostrarMaterialCurso(nuevoCurso.material);
        });

        nuevaFila.querySelector(".btn-delete").addEventListener("click", function() {
            const fila = this.closest('tr');
            const nombreCurso = fila.cells[0].querySelector('strong').textContent;
            
            cursosRegistrados = cursosRegistrados.filter(curso => curso.nombre !== nombreCurso);
            fila.remove();
            actualizarContadorCursos();
        });

        form.reset();
        uploadedFiles = [];
        actualizarListaArchivos();
        fechaInicioInput.removeAttribute('data-iso-date');
        fechaFinInput.removeAttribute('data-iso-date');
        actualizarContadorCursos();
    });

    btnOpenCalendarInicio.addEventListener('click', () => openCalendar('inicio'));
    btnOpenCalendarFin.addEventListener('click', () => openCalendar('fin'));
    btnCloseCalendar.addEventListener('click', closeCalendar);
    btnCancelCalendar.addEventListener('click', closeCalendar);
    btnConfirmDate.addEventListener('click', confirmDate);
    btnPrevMonth.addEventListener('click', () => cambiarMes(-1));
    btnNextMonth.addEventListener('click', () => cambiarMes(1));

    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--primary-color)';
        fileUploadArea.style.background = '#f0f8ff';
    });
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.borderColor = 'var(--border-color)';
        fileUploadArea.style.background = '';
    });
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--border-color)';
        fileUploadArea.style.background = '';
        fileInput.files = e.dataTransfer.files;
        manejarSubidaArchivos({ target: fileInput });
    });

    fileInput.addEventListener('change', manejarSubidaArchivos);

    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            closeCalendar();
        }
    });

    materialModal.addEventListener('click', (e) => {
        if (e.target === materialModal) {
            cerrarMaterialModal();
        }
    });

    btnCloseMaterial.addEventListener('click', cerrarMaterialModal);
    btnCloseMaterialFooter.addEventListener('click', cerrarMaterialModal);

    document.querySelectorAll('.btn-material').forEach(button => {
        button.addEventListener('click', function() {
            const fila = this.closest('tr');
            const nombreCurso = fila.cells[0].querySelector('strong').textContent;
            const curso = cursosRegistrados.find(c => c.nombre === nombreCurso);
            if (curso) {
                mostrarMaterialCurso(curso.material);
            }
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const fila = this.closest('tr');
            const nombreCurso = fila.cells[0].querySelector('strong').textContent;
            
            cursosRegistrados = cursosRegistrados.filter(curso => curso.nombre !== nombreCurso);
            fila.remove();
            actualizarContadorCursos();
        });
    });

    actualizarContadorCursos();
});