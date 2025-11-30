-- ---
-- 1. Tipos de Dato Personalizados (ENUM)
-- ---

-- Reutilizamos el tipo_turno del código anterior
CREATE TYPE tipo_turno AS ENUM (
    'matutino',
    'nocturno',
    'vespertino',
    'madrugada',
    'completo'
);

-- Nuevo tipo ENUM para estados del empleado
CREATE TYPE tipo_estado_empleado AS ENUM (
    'activo',
    'inactivo',
    'licencia',
    'vacaciones'
);

-- ---
-- 2. Tabla de Especialidades
-- ---
-- Tabla maestra para mantener las especialidades disponibles

CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE
);

-- ---
-- 3. Tabla Principal de Enfermeros
-- ---
-- Versión extendida con todos los campos necesarios para el registro

CREATE TABLE enfermeros (
    id SERIAL PRIMARY KEY,
    
    -- Información personal
    nombre_completo VARCHAR(255) NOT NULL,
    id_empleado VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    
    -- Información laboral
    especialidad_id INTEGER REFERENCES especialidades(id),
    fecha_contratacion DATE NOT NULL,
    estado tipo_estado_empleado NOT NULL DEFAULT 'activo',
    turno_principal tipo_turno NOT NULL,
    
    -- Información adicional
    avatar_url TEXT,
    
    -- Campos de auditoría
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por VARCHAR(100) DEFAULT 'sistema',
    
    -- Restricciones adicionales
    CONSTRAINT check_fecha_contratacion_futura 
        CHECK (fecha_contratacion <= CURRENT_DATE),
    CONSTRAINT check_email_format 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ---
-- 4. Inserción de Datos de Especialidades
-- ---

INSERT INTO especialidades (nombre, descripcion) VALUES
('Enfermería General', 'Atención general de pacientes en diversas áreas'),
('Cuidados Intensivos', 'Especialización en unidades de cuidados intensivos'),
('Pediatría', 'Atención especializada en pacientes pediátricos'),
('Urgencias', 'Manejo de pacientes en área de urgencias'),
('Oncología', 'Cuidados especializados para pacientes oncológicos'),
('Cardiología', 'Atención a pacientes con problemas cardíacos'),
('Geriatría', 'Cuidados especializados para adultos mayores'),
('Quirófano', 'Enfermería especializada en áreas quirúrgicas'),
('Salud Mental', 'Atención a pacientes con problemas de salud mental'),
('Comunidad', 'Enfermería comunitaria y de salud pública');

-- ---
-- 5. Inserción de Datos de Ejemplo para Enfermeros
-- ---

INSERT INTO enfermeros (
    nombre_completo, 
    id_empleado, 
    email, 
    telefono, 
    especialidad_id, 
    fecha_contratacion, 
    estado, 
    turno_principal, 
    avatar_url
) VALUES
('Lamine Yamal', 'ENF001', 'lamine.yamal@aliviohospital.com', '+52-55-1234-5678', 1, '2023-01-15', 'activo', 'matutino', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'),
('Esteban Trabajos', 'ENF002', 'esteban.trabajos@aliviohospital.com', '+52-55-1234-5679', 2, '2023-02-20', 'activo', 'nocturno', NULL),
('Walter Blanco', 'ENF003', 'walter.blanco@aliviohospital.com', '+52-55-1234-5680', 3, '2023-03-10', 'licencia', 'vespertino', NULL),
('María González', 'ENF004', 'maria.gonzalez@aliviohospital.com', '+52-55-1234-5681', 4, '2022-11-05', 'activo', 'matutino', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'),
('Ana Rodríguez', 'ENF005', 'ana.rodriguez@aliviohospital.com', '+52-55-1234-5682', 5, '2023-04-18', 'activo', 'nocturno', NULL),
('Carlos López', 'ENF006', 'carlos.lopez@aliviohospital.com', '+52-55-1234-5683', 6, '2022-12-12', 'activo', 'vespertino', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'),
('Laura Martínez', 'ENF007', 'laura.martinez@aliviohospital.com', '+52-55-1234-5684', 7, '2023-05-22', 'vacaciones', 'matutino', NULL),
('Javier Pérez', 'ENF008', 'javier.perez@aliviohospital.com', '+52-55-1234-5685', 8, '2023-06-30', 'activo', 'nocturno', NULL),
('Sofía Hernández', 'ENF009', 'sofia.hernandez@aliviohospital.com', '+52-55-1234-5686', 9, '2023-07-14', 'activo', 'vespertino', NULL),
('Miguel Sánchez', 'ENF010', 'miguel.sanchez@aliviohospital.com', '+52-55-1234-5687', 10, '2023-08-08', 'activo', 'matutino', NULL);

-- ---
-- 6. Trigger para actualizar fecha_actualizacion
-- ---

CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_enfermeros
    BEFORE UPDATE ON enfermeros
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

-- ---
-- 7. Vistas útiles
-- ---

-- Vista para listado de enfermeros con información completa
CREATE VIEW vista_enfermeros_completa AS
SELECT 
    e.id,
    e.nombre_completo,
    e.id_empleado,
    e.email,
    e.telefono,
    es.nombre as especialidad,
    e.fecha_contratacion,
    e.estado,
    e.turno_principal,
    e.avatar_url,
    e.fecha_creacion,
    e.fecha_actualizacion
FROM enfermeros e
LEFT JOIN especialidades es ON e.especialidad_id = es.id;

-- Vista para dashboard (estadísticas)
CREATE VIEW vista_estadisticas_enfermeros AS
SELECT 
    COUNT(*) as total_enfermeros,
    COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
    COUNT(CASE WHEN estado = 'inactivo' THEN 1 END) as inactivos,
    COUNT(CASE WHEN estado = 'licencia' THEN 1 END) as licencia,
    COUNT(CASE WHEN estado = 'vacaciones' THEN 1 END) as vacaciones,
    COUNT(CASE WHEN turno_principal = 'matutino' THEN 1 END) as turno_matutino,
    COUNT(CASE WHEN turno_principal = 'vespertino' THEN 1 END) as turno_vespertino,
    COUNT(CASE WHEN turno_principal = 'nocturno' THEN 1 END) as turno_nocturno
FROM enfermeros;

-- ---
-- 8. Índices para mejorar el rendimiento
-- ---

CREATE INDEX idx_enfermeros_estado ON enfermeros(estado);
CREATE INDEX idx_enfermeros_turno ON enfermeros(turno_principal);
CREATE INDEX idx_enfermeros_especialidad ON enfermeros(especialidad_id);
CREATE INDEX idx_enfermeros_fecha_contratacion ON enfermeros(fecha_contratacion);
CREATE INDEX idx_enfermeros_email ON enfermeros(email);
CREATE INDEX idx_enfermeros_id_empleado ON enfermeros(id_empleado);