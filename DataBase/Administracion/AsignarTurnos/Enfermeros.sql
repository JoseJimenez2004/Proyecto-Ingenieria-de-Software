-- ---
-- 1. Tabla de Enfermeros
-- ---
-- Primero, creamos la tabla para almacenar al personal de enfermería.
-- La tabla 'asignaciones_turnos' dependerá de esta.

CREATE TABLE enfermeros (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    -- Podrías añadir un ID de empleado, como el 'ENF001' que se ve en la tabla
    id_empleado VARCHAR(50) UNIQUE,
    -- otros campos como: fecha_contratacion, especialidad, etc.
    avatar_url TEXT -- Para guardar la URL de la imagen
);

-- Insertamos los enfermeros que aparecen en tu <select> y en la tabla
INSERT INTO enfermeros (id, nombre_completo, id_empleado, avatar_url) VALUES
(1, 'Lamine Yamal', 'ENF001', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face'),
(2, 'Esteban Trabajos', 'ENF002', NULL),
(3, 'Walter Blanco', 'ENF003', NULL),
(4, 'María González', 'ENF004', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face'),
(5, 'Ana Rodríguez', 'ENF005', NULL),
(6, 'Carlos López', 'ENF006', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=40&h=40&fit=crop&crop=face'),
(7, 'Laura Martínez', 'ENF007', NULL),
(8, 'Javier Pérez', 'ENF008', NULL),
(9, 'Sofía Hernández', 'ENF009', NULL),
(10, 'Miguel Sánchez', 'ENF010', NULL);


-- ---
-- 2. Tipo de Dato Personalizado (ENUM) para Turnos
-- ---
-- Crear un tipo ENUM asegura que solo los valores de la lista
-- puedan ser insertados en la columna 'turno'.

CREATE TYPE tipo_turno AS ENUM (
    'matutino',
    'nocturno',
    'vespertino',
    'madrugada',
    'completo'
);


-- ---
-- 3. Tabla Principal de Asignaciones de Turnos
-- ---
-- Esta es la tabla que guarda los datos del formulario.

CREATE TABLE asignaciones_turnos (
    id SERIAL PRIMARY KEY,
    
    -- Llave foránea que se conecta con la tabla 'enfermeros'
    enfermero_id INTEGER NOT NULL REFERENCES enfermeros(id),
    
    -- Columna que usa el tipo ENUM que definimos
    turno tipo_turno NOT NULL,
    
    -- Fecha del turno asignado
    fecha DATE NOT NULL,
    
    -- Columna 'extra' para auditoría: registra cuándo se creó la fila
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricción Opcional: Evita que un mismo enfermero
    -- sea asignado dos veces en el mismo día.
    CONSTRAINT unique_enfermero_fecha UNIQUE (enfermero_id, fecha)
);


-- ---
-- 4. Inserción de Datos de Ejemplo
-- ---
-- Estos son los 3 turnos que ya aparecen en tu <table> HTML.

-- Turno de Lamine Yamal
INSERT INTO asignaciones_turnos (enfermero_id, turno, fecha)
VALUES (1, 'matutino', '2025-01-15');

-- Turno de María González
INSERT INTO asignaciones_turnos (enfermero_id, turno, fecha)
VALUES (4, 'nocturno', '2025-01-15');

-- Turno de Carlos López
INSERT INTO asignaciones_turnos (enfermero_id, turno, fecha)
VALUES (6, 'vespertino', '2025-01-16');