-- ---
-- 1. Tabla de Categorías de Cursos
-- ---

CREATE TABLE categorias_cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    icono VARCHAR(50),
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---
-- 2. Tabla Principal de Cursos
-- ---

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    
    -- Información básica
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    codigo_curso VARCHAR(50) UNIQUE, -- Código único del curso ej: "CUR-2025-001"
    
    -- Categorización
    categoria_id INTEGER REFERENCES categorias_cursos(id),
    area VARCHAR(100) NOT NULL,
    nivel_dificultad VARCHAR(50) DEFAULT 'intermedio', -- 'basico', 'intermedio', 'avanzado'
    
    -- Detalles del curso
    duracion_horas INTEGER NOT NULL CHECK (duracion_horas > 0),
    cupo_maximo INTEGER NOT NULL CHECK (cupo_maximo > 0),
    inscritos_actual INTEGER DEFAULT 0,
    
    -- Fechas y horarios
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    horario VARCHAR(100), -- Ej: "Lunes y Miércoles 14:00-16:00"
    lugar VARCHAR(200),
    
    -- Instructor y costos
    instructor VARCHAR(255),
    instructor_contacto VARCHAR(255),
    costo DECIMAL(10,2) DEFAULT 0,
    moneda VARCHAR(3) DEFAULT 'MXN',
    
    -- Requisitos y aprobación
    requiere_aprobar BOOLEAN DEFAULT FALSE,
    calificacion_minima DECIMAL(3,1) DEFAULT 7.0, -- Calificación mínima para aprobar
    prerequisitos TEXT[], -- Array de prerequisitos
    
    -- Estado y metadatos
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    imagen_url TEXT, -- URL de imagen del curso
    
    -- Campos de auditoría
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por VARCHAR(100) DEFAULT 'sistema',
    
    -- Restricciones
    CONSTRAINT check_fechas_validas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT check_inscritos_no_mayor_cupo CHECK (inscritos_actual <= cupo_maximo)
);

-- ---
-- 3. Tabla de Módulos del Curso
-- ---

CREATE TABLE modulos_curso (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    
    -- Información del módulo
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL, -- Orden de los módulos en el curso
    
    -- Detalles del módulo
    duracion_minutos INTEGER, -- Duración estimada en minutos
    contenido TEXT, -- Contenido detallado del módulo
    recursos TEXT[], -- Array de recursos o materiales
    
    -- Metadatos
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricción de orden único por curso
    UNIQUE(curso_id, orden)
);

-- ---
-- 4. Tabla de Sesiones del Curso
-- ---

CREATE TABLE sesiones_curso (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    
    -- Información de la sesión
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_sesion DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    
    -- Detalles de la sesión
    lugar VARCHAR(200),
    instructor VARCHAR(255), -- Puede ser diferente al instructor principal
    tipo_sesion VARCHAR(50) DEFAULT 'teorica', -- 'teorica', 'practica', 'evaluacion'
    
    -- Estado
    completada BOOLEAN DEFAULT FALSE,
    
    -- Campos de auditoría
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricciones
    CONSTRAINT check_horario_valido CHECK (hora_fin > hora_inicio)
);

-- ---
-- 5. Inserción de Categorías de Cursos
-- ---

INSERT INTO categorias_cursos (nombre, descripcion, color, icono) VALUES
('Cuidados Intensivos', 'Cursos especializados en unidades de cuidados intensivos', '#DC2626', 'bi-heart-pulse'),
('Pediatría', 'Cursos enfocados en atención pediátrica y neonatal', '#2563EB', 'bi-bandaid'),
('Urgencias', 'Capacitación para manejo de situaciones de emergencia', '#D97706', 'bi-lightning'),
('Enfermería General', 'Cursos de actualización para enfermería general', '#059669', 'bi-person-plus'),
('Especialidades Quirúrgicas', 'Cursos para áreas quirúrgicas y de procedimientos', '#7C3AED', 'bi-scissors'),
('Salud Mental', 'Capacitación en cuidados de salud mental', '#8B5CF6', 'bi-activity'),
('Gestión y Liderazgo', 'Cursos de desarrollo directivo y gestión', '#475569', 'bi-graph-up'),
('Investigación', 'Cursos de metodología de investigación en enfermería', '#EC4899', 'bi-search');

-- ---
-- 6. Inserción de Cursos de Ejemplo
-- ---

INSERT INTO cursos (
    nombre,
    descripcion,
    codigo_curso,
    categoria_id,
    area,
    nivel_dificultad,
    duracion_horas,
    cupo_maximo,
    fecha_inicio,
    fecha_fin,
    horario,
    lugar,
    instructor,
    instructor_contacto,
    costo,
    requiere_aprobar,
    calificacion_minima,
    prerequisitos,
    destacado,
    imagen_url
) VALUES
(
    'RCP Avanzado y Manejo de Vía Aérea',
    'Curso especializado en reanimación cardiopulmonar avanzada y manejo de vía aérea difícil en situaciones críticas',
    'CUR-2025-001',
    2, -- Urgencias
    'Urgencias y Emergencias',
    'avanzado',
    16,
    12,
    '2025-02-15',
    '2025-02-20',
    'Lunes a Viernes 08:00-12:00',
    'Laboratorio de Simulación - Torre de Especialidades',
    'Dr. Roberto Mendoza',
    'rmendoza@aliviohospital.com',
    2500.00,
    true,
    8.0,
    ARRAY['Certificación RCP básica', 'Mínimo 2 años de experiencia en urgencias'],
    true,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop'
),
(
    'Cuidados Intensivos Neonatales',
    'Capacitación especializada en cuidados intensivos para recién nacidos y neonatos críticos',
    'CUR-2025-002',
    1, -- Cuidados Intensivos
    'Neonatología',
    'avanzado',
    40,
    8,
    '2025-03-01',
    '2025-03-30',
    'Sábados 09:00-17:00',
    'UCI Neonatal - Edificio Materno Infantil',
    'Dra. Elena Sánchez',
    'esanchez@aliviohospital.com',
    3500.00,
    true,
    8.5,
    ARRAY['Experiencia en pediatría', 'Certificación en cuidados intensivos'],
    true,
    'https://images.unsplash.com/photo-1584824486537-52f48c23c359?w=400&h=250&fit=crop'
),
(
    'Actualización en Farmacología Hospitalaria',
    'Curso de actualización en farmacología, interacciones medicamentosas y administración segura de medicamentos',
    'CUR-2025-003',
    4, -- Enfermería General
    'Farmacología',
    'intermedio',
    12,
    20,
    '2025-02-10',
    '2025-02-12',
    'Lunes a Miércoles 16:00-20:00',
    'Aula 3 - Centro de Capacitación',
    'QFB. Carlos Ruiz',
    'cruiz@aliviohospital.com',
    1200.00,
    true,
    7.0,
    ARRAY['Conocimientos básicos de farmacología'],
    false,
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
),
(
    'Comunicación Asertiva y Empatía en el Cuidado',
    'Desarrollo de habilidades de comunicación empática y asertiva para mejorar la relación con pacientes y familias',
    'CUR-2025-004',
    6, -- Salud Mental
    'Comunicación y Relación',
    'basico',
    8,
    25,
    '2025-02-20',
    '2025-02-22',
    'Jueves y Viernes 14:00-18:00',
    'Sala de Conferencias - Piso 5',
    'Lic. Ana García',
    'agarcia@aliviohospital.com',
    800.00,
    false,
    0.0,
    ARRAY[]::TEXT[],
    false,
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop'
);

-- ---
-- 7. Inserción de Módulos de Ejemplo
-- ---

-- Módulos para RCP Avanzado
INSERT INTO modulos_curso (curso_id, titulo, descripcion, orden, duracion_minutos, recursos) VALUES
(1, 'Fundamentos de RCP Avanzado', 'Revisión de protocolos actualizados y fundamentos científicos', 1, 120, ARRAY['Manual RCP 2025', 'Presentación PDF']),
(1, 'Manejo de Vía Aérea Difícil', 'Técnicas avanzadas para intubación y manejo de vía aérea', 2, 180, ARRAY['Video demostrativo', 'Guía práctica']),
(1, 'Farmacología en Emergencias', 'Uso de medicamentos en situaciones de reanimación', 3, 90, ARRAY['Lista de medicamentos', 'Dosificaciones']),
(1, 'Simulación de Casos Clínicos', 'Práctica con simuladores de alta fidelidad', 4, 240, ARRAY['Casos clínicos', 'Checklist evaluación']);

-- Módulos para Cuidados Intensivos Neonatales
INSERT INTO modulos_curso (curso_id, titulo, descripcion, orden, duracion_minutos) VALUES
(2, 'Fisiología Neonatal', 'Características fisiológicas del recién nacido', 1, 180),
(2, 'Manejo del Recién Nacido Crítico', 'Protocolos de estabilización y traslado', 2, 240),
(2, 'Ventilación Mecánica en Neonatos', 'Principios y técnicas de ventilación mecánica', 3, 210),
(2, 'Nutrición y Metabolismo', 'Cuidados nutricionales especializados', 4, 120);

-- ---
-- 8. Inserción de Sesiones de Ejemplo
-- ---

-- Sesiones para RCP Avanzado
INSERT INTO sesiones_curso (curso_id, titulo, fecha_sesion, hora_inicio, hora_fin, lugar, tipo_sesion) VALUES
(1, 'Teoría: Fundamentos RCP', '2025-02-15', '08:00', '10:00', 'Aula 1', 'teorica'),
(1, 'Práctica: Compresiones Torácicas', '2025-02-15', '10:30', '12:00', 'Laboratorio Simulación', 'practica'),
(1, 'Manejo de Vía Aérea - Teoría', '2025-02-16', '08:00', '09:30', 'Aula 1', 'teorica'),
(1, 'Práctica: Intubación', '2025-02-16', '10:00', '12:00', 'Laboratorio Simulación', 'practica');

-- ---
-- 9. Vistas Útiles
-- ---

-- Vista para cursos activos con información completa
CREATE VIEW vista_cursos_activos AS
SELECT 
    c.id,
    c.nombre,
    c.descripcion,
    c.codigo_curso,
    cat.nombre as categoria,
    c.area,
    c.nivel_dificultad,
    c.duracion_horas,
    c.cupo_maximo,
    c.inscritos_actual,
    (c.cupo_maximo - c.inscritos_actual) as cupos_disponibles,
    c.fecha_inicio,
    c.fecha_fin,
    c.horario,
    c.lugar,
    c.instructor,
    c.costo,
    c.requiere_aprobar,
    c.destacado,
    c.imagen_url,
    CASE 
        WHEN c.fecha_inicio > CURRENT_DATE THEN 'PROXIMO'
        WHEN c.fecha_inicio <= CURRENT_DATE AND c.fecha_fin >= CURRENT_DATE THEN 'EN_CURSO'
        ELSE 'FINALIZADO'
    END as estado_curso
FROM cursos c
JOIN categorias_cursos cat ON c.categoria_id = cat.id
WHERE c.activo = true
ORDER BY c.fecha_inicio, c.destacado DESC;

-- Vista para cursos con estadísticas de inscripción
CREATE VIEW vista_cursos_estadisticas AS
SELECT 
    c.id,
    c.nombre,
    c.cupo_maximo,
    c.inscritos_actual,
    ROUND((c.inscritos_actual * 100.0 / c.cupo_maximo), 1) as porcentaje_ocupacion,
    COUNT(ic.id) FILTER (WHERE ic.estado = 'completado') as completados,
    COUNT(ic.id) FILTER (WHERE ic.estado = 'en_curso') as en_curso,
    ROUND(AVG(ic.calificacion) FILTER (WHERE ic.calificacion IS NOT NULL), 1) as calificacion_promedio
FROM cursos c
LEFT JOIN inscripciones_cursos ic ON c.id = ic.curso_id
WHERE c.activo = true
GROUP BY c.id, c.nombre, c.cupo_maximo, c.inscritos_actual;

-- Vista para próximos cursos
CREATE VIEW vista_proximos_cursos AS
SELECT 
    id,
    nombre,
    codigo_curso,
    categoria,
    fecha_inicio,
    fecha_fin,
    cupos_disponibles,
    instructor,
    costo,
    destacado
FROM vista_cursos_activos
WHERE fecha_inicio >= CURRENT_DATE
ORDER BY fecha_inicio
LIMIT 10;

-- ---
-- 10. Funciones y Procedimientos
-- ---

-- Función para verificar disponibilidad de cupo
CREATE OR REPLACE FUNCTION verificar_cupo_curso(
    p_curso_id INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_cupos_disponibles INTEGER;
BEGIN
    SELECT (cupo_maximo - inscritos_actual) 
    INTO v_cupos_disponibles
    FROM cursos 
    WHERE id = p_curso_id;
    
    RETURN COALESCE(v_cupos_disponibles, 0) > 0;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar contador de inscritos
CREATE OR REPLACE FUNCTION actualizar_contador_inscritos()
RETURNS TRIGGER AS $$
BEGIN
    -- Incrementar contador al insertar nueva inscripción
    IF TG_OP = 'INSERT' THEN
        UPDATE cursos 
        SET inscritos_actual = inscritos_actual + 1
        WHERE id = NEW.curso_id;
    
    -- Decrementar contador al eliminar inscripción
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursos 
        SET inscritos_actual = inscritos_actual - 1
        WHERE id = OLD.curso_id;
    
    -- Manejar cambios de estado que afectan el contador
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.estado NOT IN ('cancelado', 'rechazado') AND NEW.estado IN ('cancelado', 'rechazado') THEN
            UPDATE cursos 
            SET inscritos_actual = inscritos_actual - 1
            WHERE id = NEW.curso_id;
        ELSIF OLD.estado IN ('cancelado', 'rechazado') AND NEW.estado NOT IN ('cancelado', 'rechazado') THEN
            UPDATE cursos 
            SET inscritos_actual = inscritos_actual + 1
            WHERE id = NEW.curso_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para generar código de curso automático
CREATE OR REPLACE FUNCTION generar_codigo_curso()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo_curso IS NULL THEN
        NEW.codigo_curso := 'CUR-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || 
                           LPAD(NEXTVAL('cursos_codigo_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---
-- 11. Triggers
-- ---

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_curso()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_curso
    BEFORE UPDATE ON cursos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_curso();

-- Trigger para actualizar contador de inscritos
CREATE TRIGGER trigger_actualizar_inscritos
    AFTER INSERT OR UPDATE OR DELETE ON inscripciones_cursos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_inscritos();

-- Trigger para generar código de curso automático
CREATE TRIGGER trigger_generar_codigo_curso
    BEFORE INSERT ON cursos
    FOR EACH ROW
    EXECUTE FUNCTION generar_codigo_curso();

-- ---
-- 12. Índices para Mejor Rendimiento
-- ---

CREATE INDEX idx_cursos_activos ON cursos(activo, fecha_inicio);
CREATE INDEX idx_cursos_categoria ON cursos(categoria_id);
CREATE INDEX idx_cursos_fechas ON cursos(fecha_inicio, fecha_fin);
CREATE INDEX idx_cursos_destacados ON cursos(destacado, activo);
CREATE INDEX idx_modulos_curso ON modulos_curso(curso_id, orden);
CREATE INDEX idx_sesiones_curso ON sesiones_curso(curso_id, fecha_sesion);
CREATE INDEX idx_cursos_inscritos ON cursos(inscritos_actual, cupo_maximo);