-- ---
-- 1. Tabla de Enfermeros (ya existe del código anterior)
-- ---

-- ---
-- 2. Tabla de Cursos y Actividades
-- ---
-- Esta tabla almacena los diferentes cursos y actividades disponibles

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    area VARCHAR(100) NOT NULL,
    duracion_horas INTEGER,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE
);

-- ---
-- 3. Tipos de Dato Personalizados (ENUM)
-- ---

-- Reutilizamos el tipo_turno del código anterior
CREATE TYPE tipo_turno AS ENUM (
    'matutino',
    'nocturno',
    'vespertino',
    'madrugada',
    'completo'
);

-- Nuevo tipo ENUM para estados de participación
CREATE TYPE tipo_estado_actividad AS ENUM (
    'completado',
    'en_progreso',
    'pendiente'
);

-- ---
-- 4. Tabla Principal de Actividades de Participación
-- ---
-- Esta tabla registra la participación del personal en cursos y actividades

CREATE TABLE actividades_participacion (
    id SERIAL PRIMARY KEY,
    
    -- Llave foránea que se conecta con la tabla 'enfermeros'
    enfermero_id INTEGER NOT NULL REFERENCES enfermeros(id),
    
    -- Llave foránea que se conecta con la tabla 'cursos'
    curso_id INTEGER NOT NULL REFERENCES cursos(id),
    
    -- Área o especialidad de la actividad
    area VARCHAR(100) NOT NULL,
    
    -- Turno en que se realiza la actividad
    turno tipo_turno NOT NULL,
    
    -- Fecha de participación
    fecha DATE NOT NULL,
    
    -- Estado de la participación
    estado tipo_estado_actividad NOT NULL DEFAULT 'pendiente',
    
    -- Columna para auditoría
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricción para evitar duplicados
    CONSTRAINT unique_enfermero_curso_fecha UNIQUE (enfermero_id, curso_id, fecha)
);

-- ---
-- 5. Inserción de Datos de Ejemplo para Cursos
-- ---

INSERT INTO cursos (nombre, descripcion, area, duracion_horas) VALUES
('RCP Avanzado', 'Curso de reanimación cardiopulmonar avanzado para personal de enfermería', 'Urgencias', 8),
('Manejo de Vías Intravenosas', 'Técnicas avanzadas para inserción y manejo de vías IV', 'Enfermería General', 6),
('Cuidados Intensivos Neonatales', 'Especialización en cuidados para recién nacidos en estado crítico', 'Pediatría', 12),
('Bioética en Enfermería', 'Principios éticos en la práctica de enfermería', 'Ética Médica', 4),
('Manejo del Dolor', 'Estrategias para el control y manejo del dolor en pacientes', 'Oncología', 6),
('Prevención de Infecciones', 'Protocolos para prevención y control de infecciones nosocomiales', 'Epidemiología', 5);

-- ---
-- 6. Inserción de Datos de Ejemplo para Participaciones
-- ---

-- Participaciones de Lamine Yamal
INSERT INTO actividades_participacion (enfermero_id, curso_id, area, turno, fecha, estado) VALUES
(1, 1, 'Urgencias', 'matutino', '2025-01-10', 'completado'),
(1, 3, 'Pediatría', 'vespertino', '2025-01-12', 'en_progreso');

-- Participaciones de María González
INSERT INTO actividades_participacion (enfermero_id, curso_id, area, turno, fecha, estado) VALUES
(4, 2, 'Enfermería General', 'nocturno', '2025-01-11', 'completado'),
(4, 5, 'Oncología', 'matutino', '2025-01-15', 'pendiente');

-- Participaciones de Carlos López
INSERT INTO actividades_participacion (enfermero_id, curso_id, area, turno, fecha, estado) VALUES
(6, 4, 'Ética Médica', 'vespertino', '2025-01-09', 'completado'),
(6, 6, 'Epidemiología', 'matutino', '2025-01-14', 'en_progreso');

-- Participaciones de otros enfermeros
INSERT INTO actividades_participacion (enfermero_id, curso_id, area, turno, fecha, estado) VALUES
(2, 1, 'Urgencias', 'nocturno', '2025-01-13', 'completado'),
(3, 2, 'Enfermería General', 'matutino', '2025-01-16', 'pendiente'),
(5, 3, 'Pediatría', 'vespertino', '2025-01-17', 'en_progreso');

-- ---
-- 7. Vistas útiles para consultas frecuentes
-- ---

-- Vista para mostrar actividades con información completa
CREATE VIEW vista_actividades_completa AS
SELECT 
    ap.id,
    e.nombre_completo as enfermero,
    e.id_empleado,
    c.nombre as curso_actividad,
    ap.area,
    ap.turno,
    ap.fecha,
    ap.estado,
    ap.fecha_registro
FROM actividades_participacion ap
JOIN enfermeros e ON ap.enfermero_id = e.id
JOIN cursos c ON ap.curso_id = c.id;

-- ---
-- 8. Índices para mejorar el rendimiento
-- ---

CREATE INDEX idx_actividades_enfermero_fecha ON actividades_participacion(enfermero_id, fecha);
CREATE INDEX idx_actividades_curso ON actividades_participacion(curso_id);
CREATE INDEX idx_actividades_area ON actividades_participacion(area);
CREATE INDEX idx_actividades_estado ON actividades_participacion(estado);