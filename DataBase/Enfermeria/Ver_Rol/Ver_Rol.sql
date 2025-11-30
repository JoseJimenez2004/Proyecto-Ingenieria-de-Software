-- ---
-- 1. Tipos de Dato Personalizados (ENUM)
-- ---

-- Tipo para estados del empleado
CREATE TYPE tipo_estado_empleado AS ENUM (
    'activo',
    'inactivo',
    'licencia_medica',
    'vacaciones',
    'suspendido',
    'capacitacion'
);

-- Tipo para turnos (reutilizado)
CREATE TYPE tipo_turno AS ENUM (
    'matutino',
    'vespertino',
    'nocturno',
    'mixto',
    'administrativo'
);

-- Tipo para tipos de contrato
CREATE TYPE tipo_contrato AS ENUM (
    'tiempo_completo',
    'medio_tiempo',
    'temporal',
    'honorarios',
    'practicas'
);

-- ---
-- 2. Tabla de Especialidades Médicas
-- ---

CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL, -- 'enfermeria_general', 'especializada', 'administrativa'
    requiere_certificacion BOOLEAN DEFAULT FALSE,
    color VARCHAR(7) DEFAULT '#6B7280',
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---
-- 3. Tabla de Grados Académicos
-- ---

CREATE TABLE grados_academicos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    nivel VARCHAR(50) NOT NULL, -- 'tecnico', 'licenciatura', 'especialidad', 'maestria', 'doctorado'
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- ---
-- 4. Tabla Principal de Enfermeros
-- ---

CREATE TABLE enfermeros (
    id SERIAL PRIMARY KEY,
    
    -- ========== INFORMACIÓN PERSONAL ==========
    nombre_completo VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20) CHECK (genero IN ('masculino', 'femenino', 'otro', 'prefiero_no_decir')),
    
    -- ========== INFORMACIÓN DE CONTACTO ==========
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT,
    
    -- ========== INFORMACIÓN PROFESIONAL ==========
    id_empleado VARCHAR(50) UNIQUE NOT NULL,
    numero_cedula VARCHAR(50) UNIQUE, -- Cédula profesional
    especialidad_id INTEGER REFERENCES especialidades(id),
    grado_academico_id INTEGER REFERENCES grados_academicos(id),
    fecha_contratacion DATE NOT NULL,
    tipo_contrato tipo_contrato NOT NULL DEFAULT 'tiempo_completo',
    
    -- ========== INFORMACIÓN LABORAL ==========
    estado tipo_estado_empleado NOT NULL DEFAULT 'activo',
    turno_principal tipo_turno NOT NULL,
    area_trabajo VARCHAR(100), -- Área específica de trabajo dentro del hospital
    supervisor_id INTEGER REFERENCES enfermeros(id), -- Auto-referencia para jerarquía
    
    -- ========== INFORMACIÓN DE EMERGENCIA ==========
    emergencia_contacto VARCHAR(255),
    emergencia_telefono VARCHAR(20),
    emergencia_parentesco VARCHAR(50),
    
    -- ========== INFORMACIÓN ADICIONAL ==========
    avatar_url TEXT,
    habilidades TEXT[], -- Array de habilidades específicas
    observaciones TEXT,
    
    -- ========== CAMPOS DE AUDITORÍA ==========
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por VARCHAR(100) DEFAULT 'sistema',
    ultima_modificacion_por VARCHAR(100),
    
    -- ========== RESTRICCIONES ==========
    CONSTRAINT check_edad_minima CHECK (
        EXTRACT(YEAR FROM AGE(fecha_nacimiento)) >= 18
    ),
    CONSTRAINT check_fecha_contratacion_valida CHECK (
        fecha_contratacion <= CURRENT_DATE
    ),
    CONSTRAINT check_email_valido CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

-- ---
-- 5. Tabla de Certificaciones y Cursos del Personal
-- ---

CREATE TABLE certificaciones_enfermeros (
    id SERIAL PRIMARY KEY,
    enfermero_id INTEGER NOT NULL REFERENCES enfermeros(id) ON DELETE CASCADE,
    
    -- Información de la certificación
    nombre_certificacion VARCHAR(255) NOT NULL,
    institucion_emisora VARCHAR(255) NOT NULL,
    numero_certificacion VARCHAR(100),
    
    -- Fechas de la certificación
    fecha_emision DATE NOT NULL,
    fecha_expiracion DATE,
    
    -- Estado y archivos
    vigente BOOLEAN DEFAULT TRUE,
    archivo_url TEXT, -- URL del documento escaneado
    
    -- Campos de auditoría
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricciones
    CONSTRAINT check_fechas_certificacion CHECK (
        fecha_expiracion IS NULL OR fecha_expiracion > fecha_emision
    )
);

-- ---
-- 6. Tabla de Historial Laboral
-- ---

CREATE TABLE historial_laboral (
    id SERIAL PRIMARY KEY,
    enfermero_id INTEGER NOT NULL REFERENCES enfermeros(id) ON DELETE CASCADE,
    
    -- Información del puesto
    puesto VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    descripcion TEXT,
    
    -- Fechas
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    
    -- Tipo de movimiento
    tipo_movimiento VARCHAR(50) DEFAULT 'contratacion', -- 'contratacion', 'promocion', 'transferencia', 'baja'
    
    -- Campos de auditoría
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    registrado_por VARCHAR(100) DEFAULT 'sistema',
    
    -- Restricciones
    CONSTRAINT check_fechas_historial CHECK (
        fecha_fin IS NULL OR fecha_fin > fecha_inicio
    )
);

-- ---
-- 7. Inserción de Datos de Especialidades
-- ---

INSERT INTO especialidades (nombre, descripcion, categoria, requiere_certificacion, color) VALUES
-- Enfermería General
('Enfermería General', 'Atención general de pacientes en diversas áreas hospitalarias', 'enfermeria_general', false, '#3B82F6'),
('Enfermería Comunitaria', 'Atención en centros de salud y comunidad', 'enfermeria_general', false, '#60A5FA'),

-- Especialidades Clínicas
('Cuidados Intensivos', 'Especialización en unidades de cuidados intensivos', 'especializada', true, '#DC2626'),
('Pediatría', 'Atención especializada en pacientes pediátricos', 'especializada', true, '#2563EB'),
('Neonatología', 'Cuidados especializados para recién nacidos', 'especializada', true, '#7C3AED'),
('Cardiología', 'Atención a pacientes con problemas cardíacos', 'especializada', true, '#EF4444'),
('Oncología', 'Cuidados especializados para pacientes oncológicos', 'especializada', true, '#8B5CF6'),

-- Áreas Quirúrgicas
('Quirófano', 'Enfermería especializada en áreas quirúrgicas', 'especializada', true, '#059669'),
('Recuperación Post-Anestésica', 'Cuidados post-operatorios inmediatos', 'especializada', true, '#10B981'),

-- Áreas de Urgencias
('Urgencias', 'Manejo de pacientes en área de urgencias', 'especializada', true, '#D97706'),
('Traumatología', 'Atención a pacientes traumatológicos', 'especializada', true, '#F59E0B'),

-- Áreas Administrativas
('Supervisión de Enfermería', 'Roles de supervisión y coordinación', 'administrativa', true, '#475569'),
('Educación en Enfermería', 'Capacitación y formación del personal', 'administrativa', true, '#6B7280');

-- ---
-- 8. Inserción de Grados Académicos
-- ---

INSERT INTO grados_academicos (nombre, nivel, descripcion) VALUES
('Técnico en Enfermería', 'tecnico', 'Formación técnica en enfermería'),
('Licenciatura en Enfermería', 'licenciatura', 'Licenciatura en Enfermería General'),
('Especialidad en Enfermería', 'especialidad', 'Especialización en área específica'),
('Maestría en Enfermería', 'maestria', 'Maestría en Ciencias de Enfermería'),
('Doctorado en Enfermería', 'doctorado', 'Doctorado en Ciencias de Enfermería'),
('Enfermero Practicante', 'especialidad', 'Enfermero con práctica avanzada');

-- ---
-- 9. Inserción de Enfermeros de Ejemplo
-- ---

INSERT INTO enfermeros (
    nombre_completo,
    fecha_nacimiento,
    genero,
    email,
    telefono,
    direccion,
    id_empleado,
    numero_cedula,
    especialidad_id,
    grado_academico_id,
    fecha_contratacion,
    tipo_contrato,
    estado,
    turno_principal,
    area_trabajo,
    emergencia_contacto,
    emergencia_telefono,
    emergencia_parentesco,
    avatar_url,
    habilidades
) VALUES
(
    'Lamine Yamal',
    '1990-05-15',
    'masculino',
    'lamine.yamal@aliviohospital.com',
    '+52-55-1234-5678',
    'Av. Insurgentes 123, Col. Nápoles, CDMX',
    'ENF001',
    'CED-ENF-001234',
    3, -- Cuidados Intensivos
    2, -- Licenciatura
    '2023-01-15',
    'tiempo_completo',
    'activo',
    'matutino',
    'UCI Adultos',
    'María Yamal',
    '+52-55-8765-4321',
    'Esposa',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    ARRAY['RCP Avanzado', 'Manejo de ventiladores', 'Monitorización hemodinámica']
),
(
    'María González',
    '1985-08-22',
    'femenino',
    'maria.gonzalez@aliviohospital.com',
    '+52-55-2345-6789',
    'Calle Reforma 456, Col. Juárez, CDMX',
    'ENF002',
    'CED-ENF-002345',
    5, -- Pediatría
    3, -- Especialidad
    '2022-11-05',
    'tiempo_completo',
    'activo',
    'vespertino',
    'Pediatría General',
    'Carlos González',
    '+52-55-7654-3210',
    'Esposo',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    ARRAY['Cuidados pediátricos', 'Vacunación', 'Atención al niño sano']
),
(
    'Carlos López',
    '1988-12-10',
    'masculino',
    'carlos.lopez@aliviohospital.com',
    '+52-55-3456-7890',
    'Av. Universidad 789, Col. Copilco, CDMX',
    'ENF003',
    'CED-ENF-003456',
    9, -- Urgencias
    2, -- Licenciatura
    '2022-12-12',
    'tiempo_completo',
    'activo',
    'nocturno',
    'Urgencias Adultos',
    'Ana López',
    '+52-55-6543-2109',
    'Esposa',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    ARRAY['Trauma', 'RCP', 'Manejo de vía aérea']
),
(
    'Ana Rodríguez',
    '1992-03-30',
    'femenino',
    'ana.rodriguez@aliviohospital.com',
    '+52-55-4567-8901',
    'Calle Michoacán 321, Col. Condesa, CDMX',
    'ENF004',
    'CED-ENF-004567',
    6, -- Neonatología
    3, -- Especialidad
    '2023-04-18',
    'tiempo_completo',
    'licencia_medica',
    'matutino',
    'UCIN',
    'Miguel Rodríguez',
    '+52-55-5432-1098',
    'Padre',
    NULL,
    ARRAY['Cuidados del recién nacido', 'Manejo de incubadoras', 'Alimentación parenteral']
),
(
    'Javier Pérez',
    '1987-07-18',
    'masculino',
    'javier.perez@aliviohospital.com',
    '+52-55-5678-9012',
    'Av. Revolución 654, Col. San Ángel, CDMX',
    'ENF005',
    'CED-ENF-005678',
    8, -- Quirófano
    3, -- Especialidad
    '2023-06-30',
    'tiempo_completo',
    'activo',
    'mixto',
    'Quirófano Cardiovascular',
    'Laura Pérez',
    '+52-55-4321-0987',
    'Esposa',
    NULL,
    ARRAY['Cirugía cardiovascular', 'Esterilización', 'Instrumentación quirúrgica']
);

-- ---
-- 10. Inserción de Certificaciones de Ejemplo
-- ---

INSERT INTO certificaciones_enfermeros (
    enfermero_id,
    nombre_certificacion,
    institucion_emisora,
    numero_certificacion,
    fecha_emision,
    fecha_expiracion,
    vigente
) VALUES
(1, 'RCP Avanzado ACLS', 'American Heart Association', 'AHA-ACLS-2023-001', '2023-03-15', '2025-03-15', true),
(1, 'Manejo de Paciente Crítico', 'Consejo Mexicano de Enfermería', 'CME-PC-2022-045', '2022-06-20', '2024-06-20', true),
(2, 'Certificación en Pediatría', 'Consejo de Certificación en Enfermería Pediátrica', 'CCEP-2021-123', '2021-11-10', '2026-11-10', true),
(3, 'Trauma Nursing Core Course', 'Emergency Nurses Association', 'ENA-TNCC-2023-078', '2023-02-28', '2025-02-28', true),
(4, 'Neonatal Resuscitation Program', 'American Academy of Pediatrics', 'AAP-NRP-2022-156', '2022-09-15', '2024-09-15', true);

-- ---
-- 11. Inserción de Historial Laboral
-- ---

INSERT INTO historial_laboral (
    enfermero_id,
    puesto,
    area,
    descripcion,
    fecha_inicio,
    fecha_fin,
    tipo_movimiento
) VALUES
(1, 'Enfermero General', 'Hospitalización', 'Contratación inicial', '2023-01-15', '2023-06-15', 'contratacion'),
(1, 'Enfermero Especialista', 'Cuidados Intensivos', 'Promoción a área de especialidad', '2023-06-15', NULL, 'promocion'),
(2, 'Enfermero Pediátrico', 'Pediatría', 'Contratación especializada', '2022-11-05', NULL, 'contratacion'),
(3, 'Enfermero de Urgencias', 'Urgencias', 'Contratación para área de urgencias', '2022-12-12', NULL, 'contratacion');

-- ---
-- 12. Vistas Útiles
-- ---

-- Vista para lista completa de enfermeros
CREATE VIEW vista_enfermeros_completa AS
SELECT 
    e.id,
    e.nombre_completo,
    e.fecha_nacimiento,
    e.genero,
    e.email,
    e.telefono,
    e.id_empleado,
    e.numero_cedula,
    es.nombre as especialidad,
    es.categoria as categoria_especialidad,
    ga.nombre as grado_academico,
    e.fecha_contratacion,
    e.tipo_contrato,
    e.estado,
    e.turno_principal,
    e.area_trabajo,
    e.emergencia_contacto,
    e.emergencia_telefono,
    e.avatar_url,
    e.habilidades,
    e.fecha_creacion,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_contratacion)) as antiguedad_anios,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_nacimiento)) as edad,
    sup.nombre_completo as supervisor
FROM enfermeros e
LEFT JOIN especialidades es ON e.especialidad_id = es.id
LEFT JOIN grados_academicos ga ON e.grado_academico_id = ga.id
LEFT JOIN enfermeros sup ON e.supervisor_id = sup.id;

-- Vista para enfermeros activos
CREATE VIEW vista_enfermeros_activos AS
SELECT *
FROM vista_enfermeros_completa
WHERE estado = 'activo';

-- Vista para estadísticas del personal
CREATE VIEW vista_estadisticas_personal AS
SELECT 
    COUNT(*) as total_enfermeros,
    COUNT(*) FILTER (WHERE estado = 'activo') as activos,
    COUNT(*) FILTER (WHERE estado = 'licencia_medica') as licencia_medica,
    COUNT(*) FILTER (WHERE estado = 'vacaciones') as vacaciones,
    COUNT(*) FILTER (WHERE estado = 'inactivo') as inactivos,
    COUNT(*) FILTER (WHERE genero = 'masculino') as masculinos,
    COUNT(*) FILTER (WHERE genero = 'femenino') as femeninos,
    ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))), 1) as edad_promedio,
    ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_contratacion))), 1) as antiguedad_promedio,
    COUNT(DISTINCT especialidad_id) as especialidades_diferentes
FROM enfermeros;

-- ---
-- 13. Funciones y Procedimientos
-- ---

-- Función para calcular antigüedad
CREATE OR REPLACE FUNCTION calcular_antiguedad(p_enfermero_id INTEGER)
RETURNS INTERVAL AS $$
DECLARE
    v_fecha_contratacion DATE;
BEGIN
    SELECT fecha_contratacion INTO v_fecha_contratacion
    FROM enfermeros WHERE id = p_enfermero_id;
    
    RETURN AGE(CURRENT_DATE, v_fecha_contratacion);
END;
$$ LANGUAGE plpgsql;

-- Función para verificar si un ID de empleado existe
CREATE OR REPLACE FUNCTION verificar_id_empleado_existe(p_id_empleado VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM enfermeros WHERE id_empleado = p_id_empleado);
END;
$$ LANGUAGE plpgsql;

-- Función para generar ID de empleado automático
CREATE OR REPLACE FUNCTION generar_id_empleado()
RETURNS TRIGGER AS $$
DECLARE
    v_ultimo_numero INTEGER;
    v_nuevo_id VARCHAR(50);
BEGIN
    -- Obtener el último número de empleado
    SELECT COALESCE(MAX(CAST(SUBSTRING(id_empleado FROM 4) AS INTEGER)), 0)
    INTO v_ultimo_numero
    FROM enfermeros
    WHERE id_empleado LIKE 'ENF%';
    
    -- Generar nuevo ID
    v_nuevo_id := 'ENF' || LPAD((v_ultimo_numero + 1)::TEXT, 3, '0');
    
    -- Asignar el nuevo ID
    NEW.id_empleado := v_nuevo_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---
-- 14. Triggers
-- ---

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_enfermero()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_enfermero
    BEFORE UPDATE ON enfermeros
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_enfermero();

-- Trigger para generar ID de empleado automáticamente
CREATE TRIGGER trigger_generar_id_empleado
    BEFORE INSERT ON enfermeros
    FOR EACH ROW
    WHEN (NEW.id_empleado IS NULL)
    EXECUTE FUNCTION generar_id_empleado();

-- ---
-- 15. Índices para Mejor Rendimiento
-- ---

CREATE INDEX idx_enfermeros_estado ON enfermeros(estado);
CREATE INDEX idx_enfermeros_especialidad ON enfermeros(especialidad_id);
CREATE INDEX idx_enfermeros_turno ON enfermeros(turno_principal);
CREATE INDEX idx_enfermeros_fecha_contratacion ON enfermeros(fecha_contratacion);
CREATE INDEX idx_enfermeros_id_empleado ON enfermeros(id_empleado);
CREATE INDEX idx_enfermeros_email ON enfermeros(email);
CREATE INDEX idx_certificaciones_vigentes ON certificaciones_enfermeros(enfermero_id, vigente);
CREATE INDEX idx_historial_enfermero ON historial_laboral(enfermero_id, fecha_inicio);