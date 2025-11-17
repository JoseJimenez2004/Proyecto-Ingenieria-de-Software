-- ---
-- 1. Tipo de Dato Personalizado (ENUM) para Nivel de Rol
-- ---
-- Define los valores permitidos para la columna 'nivel_rol'

CREATE TYPE tipo_nivel_rol AS ENUM (
    'basico',
    'intermedio',
    'avanzado',
    'administrativo'
);


-- ---
-- 2. Tabla Principal de Roles
-- ---
-- Almacena la información de cada rol creado.

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    nivel_rol tipo_nivel_rol NOT NULL DEFAULT 'basico',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ---
-- 3. Tabla Maestra de Permisos
-- ---
-- Almacena todos los permisos disponibles en el sistema.
-- Los 'slug' (valores) se toman de los 'value' en los checkboxes del HTML.

CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    -- El 'slug' es el valor del checkbox, ej: "ver-turnos"
    slug VARCHAR(100) NOT NULL UNIQUE,
    -- El 'nombre' es la etiqueta visible, ej: "Ver Turnos"
    nombre VARCHAR(255) NOT NULL,
    -- 'categoria' es para agruparlos en la UI
    categoria VARCHAR(100)
);


-- ---
-- 4. Tabla de Unión (Pivote) Roles <-> Permisos (Relación N:M)
-- ---
-- Esta tabla vincula los roles con sus permisos.
-- Si el rol 1 tiene los permisos 1 y 3, habrá dos filas: (1, 1) y (1, 3).

CREATE TABLE roles_permisos (
    rol_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id INTEGER NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    
    -- Se crea una llave primaria compuesta para evitar duplicados
    PRIMARY KEY (rol_id, permiso_id)
);


-- ---
-- 5. Inserción de datos (Permisos y Ejemplos)
-- ---

-- Llenamos la tabla 'permisos' con todos los checkboxes del formulario
INSERT INTO permisos (slug, nombre, categoria) VALUES
('ver-turnos', 'Ver Turnos', 'Gestion de Turnos'),
('asignar-turno', 'Asignar Turnos', 'Gestion de Turnos'),
('modificar-turno', 'Modificar Turnos', 'Gestion de Turnos'),
('ver-pacientes', 'Ver Pacientes', 'Gestion de Pacientes'),
('registrar-paciente', 'Registrar Pacientes', 'Gestion de Pacientes'),
('modificar-paciente', 'Modificar Historias', 'Gestion de Pacientes'),
('ver-inventario', 'Ver Inventario', 'Gestion de Recursos'),
('gestionar-inventario', 'Gestionar Inventario', 'Gestion de Recursos'),
('solicitar-material', 'Solicitar Material', 'Gestion de Recursos'),
('ver-reportes', 'Ver Reportes', 'Reportes y Analisis'),
('generar-reportes', 'Generar Reportes', 'Reportes y Analisis'),
('exportar-datos', 'Exportar Datos', 'Reportes y Analisis');


-- Insertamos los roles de ejemplo que se ven en las tarjetas
INSERT INTO roles (nombre_rol, nivel_rol, descripcion, fecha_modificacion) VALUES 
('Enfermero Jefe', 'avanzado', 'Supervisa el personal de enfermería y coordina las actividades del turno', '2025-01-15'),
('Enfermero General', 'intermedio', 'Atención directa al paciente y seguimiento de tratamientos', '2025-01-10');


-- Asignamos los permisos a los roles de ejemplo
-- (Asumiendo que 'Enfermero Jefe' es rol_id=1 y 'Enfermero General' es rol_id=2)

-- Permisos para 'Enfermero Jefe' (Rol ID 1)
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
(1, (SELECT id FROM permisos WHERE slug = 'asignar-turno')),
(1, (SELECT id FROM permisos WHERE slug = 'ver-reportes')),
(1, (SELECT id FROM permisos WHERE slug = 'gestionar-inventario'));
-- La tarjeta dice "+5 más", pero solo insertamos los visibles como ejemplo.

-- Permisos para 'Enfermero General' (Rol ID 2)
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
(2, (SELECT id FROM permisos WHERE slug = 'ver-turnos')),
(2, (SELECT id FROM permisos WHERE slug = 'ver-pacientes')),
(2, (SELECT id FROM permisos WHERE slug = 'solicitar-material'));