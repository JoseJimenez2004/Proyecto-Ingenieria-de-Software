 //Ejemplos de datos de roles
 const roles = [
    {
        id: 1,
        nombre: "Juan Pérez",                
        rol: "Enfermero Jefe",                     
        descripcion: "Supervisa el personal de enfermería y coordina las actividades del turno.",
        permisos: ["Supervisión", "Gestión de turnos", "Acceso a reportes"]
    },
    {
        id: 2,
        nombre: "María Gómez",
        rol: "Enfermero General",
        descripcion: "Atención directa al paciente y seguimiento de tratamientos.",
        permisos: ["Atención al paciente", "Aplicación de medicamentos", "Registro clínico"]
    },
    {
        id: 3,
        nombre: "Marcos Garcia",                
        rol: "Paramedico",                     
        descripcion: "Encargado de brindar primeros auxilios a pacientes",
        permisos: ["Atención directa al paciente", "Atención de llamado de emergencias", "Traslado de pacientes"]
    },
];


// Impresion roles en pantalla principal
const grid = document.getElementById("rolesGrid");
grid.innerHTML = "";

roles.forEach(r => {
    grid.innerHTML += `
        <div class="role-card">
            <div class="role-header">
                <div class="role-title">
                    <h5>${r.rol}</h5>
                </div>
            </div>

            <p><strong>Asignado a:</strong> ${r.nombre}</p>
            <p class="role-description">${r.descripcion}</p>

            <button class="btn btn-primary btn-sm verRolBtn"
                data-id="${r.id}">
                Ver detalles
            </button>
        </div>
    `;
});

// Modal
document.querySelectorAll(".verRolBtn").forEach(btn => {
    btn.addEventListener("click", () => {

        const id = parseInt(btn.dataset.id);
        const rol = roles.find(r => r.id === id);

        document.getElementById("modalRolTitulo").textContent = rol.rol;        // ROL
        document.getElementById("modalRolDesc").textContent = rol.descripcion;
        document.getElementById("modalRolNombre").textContent = "Asignado a: " + rol.nombre;  // NOMBRE PERSONA

        const list = document.getElementById("modalRolPermisos");
        list.innerHTML = "";
        rol.permisos.forEach(p => {
            list.innerHTML += `<li class="list-group-item">${p}</li>`;
        });

        new bootstrap.Modal(document.getElementById("modalRol")).show();
    });
});