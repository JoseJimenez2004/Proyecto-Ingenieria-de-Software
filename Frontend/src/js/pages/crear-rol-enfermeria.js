document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRol");
    const rolesGrid = document.getElementById("rolesGrid");
    const totalRolesElement = document.getElementById("totalRoles");
    const totalPermisosElement = document.getElementById("totalPermisos");
    const modalDetalles = document.getElementById("modalDetalles");
    const detallesContenido = document.getElementById("detallesContenido");
    const btnCerrarDetalles = document.getElementById("btnCerrarDetalles");
    const btnCloseModal = document.querySelector(".btn-close-modal");
    const btnFiltrar = document.getElementById("btnFiltrar");

    let rolesExistentes = [
        {
            id: 1,
            nombre: "Enfermero Jefe",
            nivel: "avanzado",
            descripcion: "Supervisa el personal de enfermería y coordina las actividades del turno",
            permisos: ["asignar-turno", "modificar-turno", "ver-pacientes", "gestionar-inventario", "ver-reportes", "generar-reportes", "exportar-datos"],
            fechaModificacion: "2025-01-15"
        },
        {
            id: 2,
            nombre: "Enfermero General",
            nivel: "intermedio",
            descripcion: "Atención directa al paciente y seguimiento de tratamientos",
            permisos: ["ver-turnos", "ver-pacientes", "solicitar-material", "ver-reportes"],
            fechaModificacion: "2025-01-10"
        }
    ];

    const permisosData = {
        "ver-turnos": { nombre: "Ver Turnos", categoria: "turnos", icono: "bi-eye" },
        "asignar-turno": { nombre: "Asignar Turnos", categoria: "turnos", icono: "bi-calendar-check" },
        "modificar-turno": { nombre: "Modificar Turnos", categoria: "turnos", icono: "bi-pencil" },
        "ver-pacientes": { nombre: "Ver Pacientes", categoria: "pacientes", icono: "bi-person" },
        "registrar-paciente": { nombre: "Registrar Pacientes", categoria: "pacientes", icono: "bi-person-plus" },
        "modificar-paciente": { nombre: "Modificar Historias", categoria: "pacientes", icono: "bi-clipboard" },
        "ver-inventario": { nombre: "Ver Inventario", categoria: "recursos", icono: "bi-box" },
        "gestionar-inventario": { nombre: "Gestionar Inventario", categoria: "recursos", icono: "bi-box-seam" },
        "solicitar-material": { nombre: "Solicitar Material", categoria: "recursos", icono: "bi-cart" },
        "ver-reportes": { nombre: "Ver Reportes", categoria: "reportes", icono: "bi-graph-up" },
        "generar-reportes": { nombre: "Generar Reportes", categoria: "reportes", icono: "bi-file-earmark-text" },
        "exportar-datos": { nombre: "Exportar Datos", categoria: "reportes", icono: "bi-download" }
    };

    function actualizarEstadisticas() {
        totalRolesElement.textContent = rolesExistentes.length;
        
        const totalPermisos = rolesExistentes.reduce((total, rol) => {
            return total + rol.permisos.length;
        }, 0);
        
        totalPermisosElement.textContent = totalPermisos;
    }

    function formatearFecha(fechaISO) {
        return new Date(fechaISO).toLocaleDateString('es-ES');
    }

    function obtenerNombrePermiso(permisoKey) {
        return permisosData[permisoKey]?.nombre || permisoKey;
    }

    function obtenerCategoriaPermiso(permisoKey) {
        return permisosData[permisoKey]?.categoria || 'general';
    }

    function obtenerIconoPermiso(permisoKey) {
        return permisosData[permisoKey]?.icono || 'bi-check';
    }

    function agruparPermisosPorCategoria(permisos) {
        const categorias = {};
        
        permisos.forEach(permisoKey => {
            const categoria = obtenerCategoriaPermiso(permisoKey);
            if (!categorias[categoria]) {
                categorias[categoria] = [];
            }
            categorias[categoria].push(permisoKey);
        });
        
        return categorias;
    }

    function renderizarRoles() {
        rolesGrid.innerHTML = '';
        
        rolesExistentes.forEach(rol => {
            const permisosCategorias = agruparPermisosPorCategoria(rol.permisos);
            const totalPermisos = rol.permisos.length;
            const permisosMostrar = Object.values(permisosCategorias).flat().slice(0, 3);
            
            const roleCard = document.createElement('div');
            roleCard.className = 'role-card';
            roleCard.innerHTML = `
                <div class="role-header">
                    <div class="role-title">
                        <h5>${rol.nombre}</h5>
                        <span class="badge nivel-${rol.nivel}">${rol.nivel.charAt(0).toUpperCase() + rol.nivel.slice(1)}</span>
                    </div>
                    <div class="role-actions">
                        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${rol.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${rol.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="role-description">${rol.descripcion}</p>
                <div class="role-permissions">
                    ${permisosMostrar.map(permiso => 
                        `<span class="permiso-tag">${obtenerNombrePermiso(permiso)}</span>`
                    ).join('')}
                    ${totalPermisos > 3 ? `<span class="permiso-tag">+${totalPermisos - 3} más</span>` : ''}
                </div>
                <div class="role-footer">
                    <small class="text-muted">Última modificación: ${formatearFecha(rol.fechaModificacion)}</small>
                </div>
            `;
            
            rolesGrid.appendChild(roleCard);
            
            roleCard.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-editar') && !e.target.closest('.btn-eliminar')) {
                    mostrarDetallesRol(rol.id);
                }
            });
        });
        
        actualizarEstadisticas();
        
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editarRol(parseInt(btn.dataset.id));
            });
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                eliminarRol(parseInt(btn.dataset.id));
            });
        });
    }

    function mostrarDetallesRol(rolId) {
        const rol = rolesExistentes.find(r => r.id === rolId);
        if (!rol) return;
        
        const permisosCategorias = agruparPermisosPorCategoria(rol.permisos);
        
        detallesContenido.innerHTML = `
            <div class="detalles-rol">
                <div class="detalles-header">
                    <div class="detalles-titulo">
                        <h4>${rol.nombre}</h4>
                        <div class="detalles-nivel">
                            <span class="badge nivel-${rol.nivel}">Nivel ${rol.nivel.charAt(0).toUpperCase() + rol.nivel.slice(1)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detalles-descripcion">
                    <p>${rol.descripcion}</p>
                </div>
                
                <div class="detalles-permisos">
                    ${Object.entries(permisosCategorias).map(([categoria, permisos]) => `
                        <div class="permiso-categoria-detalle">
                            <h6>
                                <i class="bi ${categoria === 'turnos' ? 'bi-calendar-week' : 
                                               categoria === 'pacientes' ? 'bi-hospital' : 
                                               categoria === 'recursos' ? 'bi-box-seam' : 
                                               'bi-graph-up'}"></i>
                                ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                            </h6>
                            <div class="permiso-lista">
                                ${permisos.map(permiso => `
                                    <div class="permiso-item">
                                        <i class="bi ${obtenerIconoPermiso(permiso)}"></i>
                                        <span>${obtenerNombrePermiso(permiso)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        modalDetalles.style.display = 'flex';
    }

    function editarRol(rolId) {
        const rol = rolesExistentes.find(r => r.id === rolId);
        if (!rol) return;
        
        form.nombreRol.value = rol.nombre;
        form.descripcionRol.value = rol.descripcion;
        form.nivelRol.value = rol.nivel;
        
        document.querySelectorAll('input[name="permisos"]').forEach(checkbox => {
            checkbox.checked = rol.permisos.includes(checkbox.value);
        });
        
        form.scrollIntoView({ behavior: 'smooth' });
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Actualizar Rol';
        submitBtn.dataset.editing = rolId;
    }

    function eliminarRol(rolId) {
        if (confirm('¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.')) {
            rolesExistentes = rolesExistentes.filter(r => r.id !== rolId);
            renderizarRoles();
        }
    }

    function cerrarModalDetalles() {
        modalDetalles.style.display = 'none';
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nombreRol = form.nombreRol.value.trim();
        const descripcionRol = form.descripcionRol.value.trim();
        const nivelRol = form.nivelRol.value;
        const permisos = Array.from(form.querySelectorAll("input[name='permisos']:checked"))
            .map(checkbox => checkbox.value);

        if (!nombreRol) {
            alert("El nombre del rol es obligatorio.");
            return;
        }

        const rolExistente = rolesExistentes.find(r => 
            r.nombre.toLowerCase() === nombreRol.toLowerCase() && 
            !form.querySelector('button[type="submit"]').dataset.editing
        );

        if (rolExistente) {
            alert("Ya existe un rol con ese nombre.");
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const isEditing = submitBtn.dataset.editing;

        if (isEditing) {
            const rolId = parseInt(isEditing);
            const rolIndex = rolesExistentes.findIndex(r => r.id === rolId);
            
            if (rolIndex !== -1) {
                rolesExistentes[rolIndex] = {
                    ...rolesExistentes[rolIndex],
                    nombre: nombreRol,
                    descripcion: descripcionRol,
                    nivel: nivelRol,
                    permisos: permisos,
                    fechaModificacion: new Date().toISOString().split('T')[0]
                };
            }
            
            delete submitBtn.dataset.editing;
            submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Guardar Rol';
        } else {
            const nuevoRol = {
                id: Math.max(...rolesExistentes.map(r => r.id), 0) + 1,
                nombre: nombreRol,
                descripcion: descripcionRol,
                nivel: nivelRol,
                permisos: permisos,
                fechaModificacion: new Date().toISOString().split('T')[0]
            };
            
            rolesExistentes.push(nuevoRol);
        }

        form.reset();
        renderizarRoles();
        
        const mensaje = isEditing ? 'Rol actualizado correctamente' : 'Rol creado correctamente';
        mostrarMensajeExito(mensaje);
    });

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

    btnCerrarDetalles.addEventListener('click', cerrarModalDetalles);
    btnCloseModal.addEventListener('click', cerrarModalDetalles);
    
    modalDetalles.addEventListener('click', (e) => {
        if (e.target === modalDetalles) {
            cerrarModalDetalles();
        }
    });

    btnFiltrar.addEventListener('click', () => {
        const niveles = ['basico', 'intermedio', 'avanzado', 'administrativo'];
        const nivelSeleccionado = prompt('Filtrar por nivel (basico, intermedio, avanzado, administrativo) o dejar vacío para todos:');
        
        if (nivelSeleccionado === null) return;
        
        let rolesFiltrados = rolesExistentes;
        
        if (nivelSeleccionado && niveles.includes(nivelSeleccionado.toLowerCase())) {
            rolesFiltrados = rolesExistentes.filter(rol => 
                rol.nivel === nivelSeleccionado.toLowerCase()
            );
        }
        
        if (rolesFiltrados.length === 0) {
            alert('No se encontraron roles con ese criterio.');
            return;
        }
        
        rolesExistentes = rolesFiltrados;
        renderizarRoles();
        
        setTimeout(() => {
            rolesExistentes = [
                {
                    id: 1,
                    nombre: "Enfermero Jefe",
                    nivel: "avanzado",
                    descripcion: "Supervisa el personal de enfermería y coordina las actividades del turno",
                    permisos: ["asignar-turno", "modificar-turno", "ver-pacientes", "gestionar-inventario", "ver-reportes", "generar-reportes", "exportar-datos"],
                    fechaModificacion: "2025-01-15"
                },
                {
                    id: 2,
                    nombre: "Enfermero General",
                    nivel: "intermedio",
                    descripcion: "Atención directa al paciente y seguimiento de tratamientos",
                    permisos: ["ver-turnos", "ver-pacientes", "solicitar-material", "ver-reportes"],
                    fechaModificacion: "2025-01-10"
                }
            ];
            renderizarRoles();
        }, 5000);
    });

    form.addEventListener('reset', () => {
        const submitBtn = form.querySelector('button[type="submit"]');
        delete submitBtn.dataset.editing;
        submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Guardar Rol';
    });

    renderizarRoles();
});