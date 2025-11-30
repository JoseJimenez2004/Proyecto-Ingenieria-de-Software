-- Consulta para llenar dropdown de cursos disponibles
SELECT 
    id, 
    nombre,
    area,
    duracion_horas,
    (cupo_maximo - inscritos_actual) as cupos_disponibles
FROM vista_cursos_disponibles 
WHERE estado_inscripcion = 'DISPONIBLE'
ORDER BY fecha_inicio;

-- Consulta para buscar enfermeros (autocomplete)
SELECT 
    id,
    nombre_completo,
    id_empleado,
    especialidad_id
FROM enfermeros 
WHERE estado = 'activo' 
AND nombre_completo ILIKE '%María%'
ORDER BY nombre_completo;

-- Consulta para insertar nueva inscripción
INSERT INTO inscripciones_cursos (
    curso_id,
    enfermero_id,
    fecha_inscripcion,
    area_enfermero,
    turno_enfermero,
    estado,
    creado_por
) VALUES (
    1, -- curso_id
    1, -- enfermero_id
    '2025-01-25', -- fecha_inscripcion
    'Pediatría', -- area_enfermero
    'matutino', -- turno_enfermero
    'inscrito', -- estado
    'admin' -- creado_por
);

-- Consulta para ver inscripciones recientes
SELECT 
    vc.curso,
    vc.enfermero,
    vc.fecha_inscripcion,
    vc.area_enfermero,
    vc.turno_enfermero,
    vc.estado
FROM vista_inscripciones_completa vc
ORDER BY vc.fecha_inscripcion DESC
LIMIT 10;

-- Consulta para verificar si un enfermero ya está inscrito en un curso
SELECT COUNT(*) 
FROM inscripciones_cursos 
WHERE curso_id = 1 
AND enfermero_id = 1 
AND estado NOT IN ('cancelado', 'rechazado');

-- Consulta para actualizar estado de inscripción
UPDATE inscripciones_cursos 
SET 
    estado = 'completado',
    calificacion = 9.2,
    fecha_completado = CURRENT_DATE
WHERE id = 1;