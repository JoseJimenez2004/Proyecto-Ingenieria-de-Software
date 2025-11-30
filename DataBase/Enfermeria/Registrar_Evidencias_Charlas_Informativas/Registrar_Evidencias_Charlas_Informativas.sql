-- ---
-- 1. Tipos de Dato Personalizados (ENUM)
-- ---

-- Tipo para tipos de reporte
CREATE TYPE tipo_reporte AS ENUM (
    'personal',
    'capacitacion',
    'turnos',
    'rendimiento',
    'asistencia',
    'certificaciones'
);

-- Tipo para formatos de salida
CREATE TYPE tipo_formato AS ENUM (
    'pdf',
    'excel',
    'html',
    'csv'
);

-- Tipo para estados de generación de reportes
CREATE TYPE tipo_estado_reporte AS ENUM (
    'pendiente',
    'procesando',
    'completado',
    'error',
    'cancelado'
);

-- Reutilizamos tipos existentes
-- tipo_estado_empleado, tipo_turno, tipo_estado_inscripcion

-- ---
-- 2. Tabla de Configuración de Reportes
-- ---

CREATE TABLE configuracion_reportes (
    id SERIAL PRIMARY KEY,
    
    -- Información del reporte configurado
    nombre_reporte VARCHAR(255) NOT NULL,
    tipo_reporte tipo_reporte NOT NULL,
    descripcion TEXT,
    
    -- Configuración de parámetros
    parametros JSONB NOT NULL DEFAULT '{}',
    programado BOOLEAN DEFAULT FALSE,
    frecuencia VARCHAR(50), -- 'diario', 'semanal', 'mensual'
    proxima_ejecucion TIMESTAMP WITH TIME ZONE,
    
    -- Configuración de salida
    formato_salida tipo_formato NOT NULL DEFAULT 'pdf',
    destino_email VARCHAR(255)[], -- Array de emails para envío automático
    
    -- Metadatos
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por VARCHAR(100) DEFAULT 'sistema'
);

-- ---
-- 3. Tabla de Historial de Reportes Generados
-- ---

CREATE TABLE historial_reportes (
    id SERIAL PRIMARY KEY,
    
    -- Relación con configuración (opcional)
    configuracion_id INTEGER REFERENCES configuracion_reportes(id),
    
    -- Información del reporte generado
    nombre_archivo VARCHAR(500) NOT NULL,
    tipo_reporte tipo_reporte NOT NULL,
    descripcion TEXT,
    
    -- Parámetros de generación
    parametros_ejecucion JSONB NOT NULL DEFAULT '{}',
    fecha_inicio DATE,
    fecha_fin DATE,
    
    -- Información de salida
    formato tipo_formato NOT NULL,
    ruta_archivo TEXT, -- Ruta donde se guardó el archivo
    tamaño_bytes BIGINT,
    
    -- Estado y métricas
    estado tipo_estado_reporte NOT NULL DEFAULT 'completado',
    registros_procesados INTEGER,
    tiempo_ejecucion_segundos DECIMAL(8,2),
    
    -- Información del usuario que generó
    generado_por VARCHAR(100) NOT NULL,
    
    -- Campos de auditoría
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_completado TIMESTAMP WITH TIME ZONE
);

-- ---
-- 4. Tabla de Métricas para Dashboard
-- ---

CREATE TABLE metricas_dashboard (
    id SERIAL PRIMARY KEY,
    
    -- Identificación de la métrica
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    nombre_metrica VARCHAR(200) NOT NULL,
    
    -- Valores de la métrica
    valor_actual DECIMAL(15,2) NOT NULL,
    valor_anterior DECIMAL(15,2),
    valor_objetivo DECIMAL(15,2),
    
    -- Tendencia y variación
    tendencia VARCHAR(20), -- 'ascendente', 'descendente', 'estable'
    variacion_porcentaje DECIMAL(5,2),
    
    -- Período de la métrica
    fecha_medicion DATE NOT NULL DEFAULT CURRENT_DATE,
    periodo VARCHAR(50) NOT NULL, -- 'diario', 'semanal', 'mensual'
    
    -- Metadatos
    activo BOOLEAN DEFAULT TRUE,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---
-- 5. Inserción de Configuraciones de Reportes Predefinidos
-- ---

INSERT INTO configuracion_reportes (
    nombre_reporte,
    tipo_reporte,
    descripcion,
    parametros,
    formato_salida,
    activo
) VALUES
(
    'Reporte Mensual de Personal Activo',
    'personal',
    'Reporte detallado del personal de enfermería activo por área y turno',
    '{
        "incluir_contacto": true,
        "incluir_especialidad": true,
        "agrupar_por": ["area", "turno"],
        "ordenar_por": "nombre"
    }',
    'pdf',
    true
),
(
    'Reporte de Capacitaciones Completadas',
    'capacitacion',
    'Reporte de cursos de capacitación completados por el personal',
    '{
        "incluir_calificaciones": true,
        "filtrar_por_estado": ["completado"],
        "rango_calificacion": [7, 10],
        "mostrar_instructor": true
    }',
    'excel',
    true
),
(
    'Análisis de Asignación de Turnos',
    'turnos',
    'Análisis de la distribución y cobertura de turnos del personal',
    '{
        "mostrar_estadisticas": true,
        "incluir_graficas": true,
        "calcular_cobertura": true,
        "dias_semana": ["lunes", "martes", "miercoles", "jueves", "viernes"]
    }',
    'pdf',
    true
),
(
    'Métricas de Rendimiento del Personal',
    'rendimiento',
    'Reporte de productividad y rendimiento del personal de enfermería',
    '{
        "metricas": ["cursos_completados", "horas_capacitacion", "evaluaciones"],
        "periodo_comparacion": "mes_anterior",
        "mostrar_tendencias": true
    }',
    'excel',
    true
),
(
    'Reporte de Certificaciones Vigentes',
    'certificaciones',
    'Reporte de certificaciones y acreditaciones del personal',
    '{
        "incluir_vencimientos": true,
        "alertas_vencimiento": 30,
        "filtrar_activos": true
    }',
    'pdf',
    true
);

-- ---
-- 6. Inserción de Datos de Ejemplo para Historial de Reportes
-- ---

INSERT INTO historial_reportes (
    configuracion_id,
    nombre_archivo,
    tipo_reporte,
    descripcion,
    parametros_ejecucion,
    fecha_inicio,
    fecha_fin,
    formato,
    ruta_archivo,
    tamaño_bytes,
    estado,
    registros_procesados,
    tiempo_ejecucion_segundos,
    generado_por
) VALUES
(
    1,
    'reporte_personal_activo_2025_01.pdf',
    'personal',
    'Reporte mensual de personal activo - Enero 2025',
    '{"fecha_inicio": "2025-01-01", "fecha_fin": "2025-01-31", "filtro_estado": "activo"}',
    '2025-01-01',
    '2025-01-31',
    'pdf',
    '/reportes/personal/reporte_personal_activo_2025_01.pdf',
    2048576,
    'completado',
    45,
    12.5,
    'admin'
),
(
    2,
    'capacitaciones_completadas_2024_12.xlsx',
    'capacitacion',
    'Reporte de capacitaciones completadas - Diciembre 2024',
    '{"fecha_inicio": "2024-12-01", "fecha_fin": "2024-12-31", "incluir_calificaciones": true}',
    '2024-12-01',
    '2024-12-31',
    'excel',
    '/reportes/capacitacion/capacitaciones_completadas_2024_12.xlsx',
    1567890,
    'completado',
    28,
    8.2,
    'coordinador'
),
(
    3,
    'analisis_turnos_2025_01.pdf',
    'turnos',
    'Análisis de asignación de turnos - Enero 2025',
    '{"fecha_inicio": "2025-01-01", "fecha_fin": "2025-01-31", "mostrar_estadisticas": true}',
    '2025-01-01',
    '2025-01-31',
    'pdf',
    '/reportes/turnos/analisis_turnos_2025_01.pdf',
    3120456,
    'completado',
    31,
    15.8,
    'admin'
);

-- ---
-- 7. Inserción de Métricas para Dashboard
-- ---

INSERT INTO metricas_dashboard (
    categoria,
    subcategoria,
    nombre_metrica,
    valor_actual,
    valor_anterior,
    valor_objetivo,
    tendencia,
    variacion_porcentaje,
    periodo
) VALUES
-- Métricas de Personal
('personal', 'general', 'Total Enfermeros Activos', 45, 43, 50, 'ascendente', 4.65, 'mensual'),
('personal', 'general', 'Tasa de Rotación', 2.1, 2.5, 1.8, 'descendente', -16.00, 'mensual'),
('personal', 'distribucion', 'Enfermeros por Turno Matutino', 18, 17, 20, 'ascendente', 5.88, 'mensual'),
('personal', 'distribucion', 'Enfermeros por Turno Nocturno', 12, 11, 15, 'ascendente', 9.09, 'mensual'),

-- Métricas de Capacitación
('capacitacion', 'cursos', 'Cursos Activos', 8, 6, 10, 'ascendente', 33.33, 'mensual'),
('capacitacion', 'cursos', 'Tasa de Completación', 85.5, 82.3, 90.0, 'ascendente', 3.89, 'mensual'),
('capacitacion', 'participacion', 'Horas de Capacitación Promedio', 12.5, 10.8, 15.0, 'ascendente', 15.74, 'mensual'),

-- Métricas de Rendimiento
('rendimiento', 'general', 'Satisfacción del Paciente', 4.7, 4.6, 4.8, 'ascendente', 2.17, 'mensual'),
('rendimiento', 'general', 'Eficiencia en Cuidados', 92.3, 90.1, 95.0, 'ascendente', 2.44, 'mensual'),

-- Métricas Operativas
('operacional', 'turnos', 'Cobertura de Turnos', 95.8, 94.2, 98.0, 'ascendente', 1.70, 'semanal'),
('operacional', 'turnos', 'Turnos sin Cobertura', 2, 3, 0, 'descendente', -33.33, 'semanal');

-- ---
-- 8. Vistas para Reportes Predefinidos
-- ---

-- Vista para Reporte de Personal
CREATE VIEW vista_reporte_personal AS
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
    COUNT(ic.id) FILTER (WHERE ic.estado = 'completado') as cursos_completados,
    COUNT(ic.id) as total_inscripciones
FROM enfermeros e
LEFT JOIN especialidades es ON e.especialidad_id = es.id
LEFT JOIN inscripciones_cursos ic ON e.id = ic.enfermero_id
GROUP BY e.id, e.nombre_completo, e.id_empleado, e.email, e.telefono, es.nombre, e.fecha_contratacion, e.estado, e.turno_principal;

-- Vista para Reporte de Capacitación
CREATE VIEW vista_reporte_capacitacion AS
SELECT 
    c.id as curso_id,
    c.nombre as curso,
    c.area,
    c.duracion_horas,
    c.fecha_inicio,
    c.fecha_fin,
    c.instructor,
    COUNT(ic.id) as total_inscritos,
    COUNT(ic.id) FILTER (WHERE ic.estado = 'completado') as completados,
    COUNT(ic.id) FILTER (WHERE ic.estado = 'en_curso') as en_curso,
    ROUND(AVG(ic.calificacion) FILTER (WHERE ic.calificacion IS NOT NULL), 1) as calificacion_promedio
FROM cursos c
LEFT JOIN inscripciones_cursos ic ON c.id = ic.curso_id
WHERE c.activo = true
GROUP BY c.id, c.nombre, c.area, c.duracion_horas, c.fecha_inicio, c.fecha_fin, c.instructor;

-- Vista para Reporte de Turnos
CREATE VIEW vista_reporte_turnos AS
SELECT 
    fecha,
    turno,
    COUNT(DISTINCT enfermero_id) as enfermeros_asignados,
    area,
    COUNT(*) as total_asignaciones
FROM asignaciones_turnos
GROUP BY fecha, turno, area;

-- ---
-- 9. Funciones para Generación de Reportes
-- ---

-- Función para generar estadísticas de personal
CREATE OR REPLACE FUNCTION generar_estadisticas_personal(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
)
RETURNS TABLE (
    total_enfermeros BIGINT,
    activos BIGINT,
    inactivos BIGINT,
    promedio_antiguedad DECIMAL(10,2),
    turno_mas_comun VARCHAR(50),
    especialidad_mas_comun VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_enfermeros,
        COUNT(*) FILTER (WHERE estado = 'activo') as activos,
        COUNT(*) FILTER (WHERE estado != 'activo') as inactivos,
        AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_contratacion))) as promedio_antiguedad,
        (SELECT turno_principal FROM enfermeros GROUP BY turno_principal ORDER BY COUNT(*) DESC LIMIT 1) as turno_mas_comun,
        (SELECT es.nombre FROM enfermeros e JOIN especialidades es ON e.especialidad_id = es.id GROUP BY es.nombre ORDER BY COUNT(*) DESC LIMIT 1) as especialidad_mas_comun
    FROM enfermeros;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar generación de reporte
CREATE OR REPLACE FUNCTION registrar_reporte(
    p_nombre_archivo VARCHAR(500),
    p_tipo_reporte tipo_reporte,
    p_descripcion TEXT,
    p_parametros JSONB,
    p_formato tipo_formato,
    p_generado_por VARCHAR(100)
)
RETURNS INTEGER AS $$
DECLARE
    v_reporte_id INTEGER;
BEGIN
    INSERT INTO historial_reportes (
        nombre_archivo,
        tipo_reporte,
        descripcion,
        parametros_ejecucion,
        formato,
        generado_por
    ) VALUES (
        p_nombre_archivo,
        p_tipo_reporte,
        p_descripcion,
        p_parametros,
        p_formato,
        p_generado_por
    ) RETURNING id INTO v_reporte_id;
    
    RETURN v_reporte_id;
END;
$$ LANGUAGE plpgsql;

-- ---
-- 10. Triggers y Índices
-- ---

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion_reportes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_config_reportes
    BEFORE UPDATE ON configuracion_reportes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion_reportes();

-- Índices para mejor rendimiento
CREATE INDEX idx_historial_reportes_tipo ON historial_reportes(tipo_reporte, fecha_generacion);
CREATE INDEX idx_historial_reportes_estado ON historial_reportes(estado);
CREATE INDEX idx_metricas_categoria ON metricas_dashboard(categoria, fecha_medicion);
CREATE INDEX idx_config_reportes_activos ON configuracion_reportes(activo, tipo_reporte);