-- Consulta para cargar dashboard por usuario
SELECT * FROM obtener_widgets_usuario('Coordinador de Enfermería');

-- Consulta para métricas principales
SELECT 
    clave,
    descripcion,
    valor_actual,
    valor_anterior,
    variacion_porcentaje,
    tendencia,
    icono,
    color
FROM vista_metricas_consolidadas
WHERE categoria IN ('personal', 'capacitacion')
ORDER BY categoria, clave;

-- Consulta para alertas recientes
SELECT 
    titulo,
    descripcion,
    tipo,
    nivel_prioridad,
    fecha_creacion,
    accion_url,
    accion_texto
FROM vista_alertas_activas
LIMIT 10;

-- Consulta para datos de gráfico de distribución de turnos
SELECT 
    turno_principal as label,
    COUNT(*) as value,
    CASE turno_principal
        WHEN 'matutino' THEN '#3B82F6'
        WHEN 'vespertino' THEN '#8B5CF6'
        WHEN 'nocturno' THEN '#EF4444'
        ELSE '#10B981'
    END as color
FROM enfermeros 
WHERE estado = 'activo'
GROUP BY turno_principal;

-- Consulta para cursos próximos a vencer
SELECT 
    nombre as "Curso",
    TO_CHAR(fecha_fin, 'DD/MM/YYYY') as "Fecha Fin",
    inscritos_actual as "Inscritos"
FROM cursos 
WHERE fecha_fin BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
AND activo = true
ORDER BY fecha_fin;

-- Marcar alerta como leída
UPDATE dashboard_alertas 
SET leida = true 
WHERE id = 1;

-- Actualizar todas las métricas en tiempo real
SELECT actualizar_metricas_tiempo_real();