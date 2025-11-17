-- ---
-- 1. Tabla de Pisos (Dependencia)
-- ---
-- Basada en el <select name="piso">.
-- Esta tabla almacena la información de cada piso.

CREATE TABLE pisos (
    id SERIAL PRIMARY KEY,
    -- Usamos el 'value' numérico del select
    numero_piso INTEGER NOT NULL UNIQUE,
    -- Usamos el texto del select
    especialidad VARCHAR(255) NOT NULL
);

-- Insertamos los pisos que aparecen en el dropdown
INSERT INTO pisos (id, numero_piso, especialidad) VALUES
(1, 1, 'Pediatría'),
(2, 2, 'Ginecología'),
(3, 3, 'Cirugía'),
(4, 4, 'Cardiología'),
(5, 5, 'Ortopedia');


-- ---
-- 2. Tipo de Dato Personalizado (ENUM) para Turno
-- ---
-- Basado en el <select name="turno">

CREATE TYPE tipo_turno_reporte_enum AS ENUM (
    'matutino',
    'vespertino',
    'nocturno'
);


-- ---
-- 3. Tabla Principal 'reportes_diarios'
-- ---
-- Esta tabla almacena los datos del formulario 'formReporte'.

CREATE TABLE reportes_diarios (
    id SERIAL PRIMARY KEY,
    
    -- Fecha del reporte
    fecha_reporte DATE NOT NULL,
    
    -- Llave foránea que se conecta con la tabla 'pisos'
    piso_id INTEGER NOT NULL REFERENCES pisos(id),
    
    -- Turno del reporte. Es NULO si se selecciona "Todos los turnos".
    turno tipo_turno_reporte_enum,
    
    -- Datos numéricos (default 0 si no se ingresan)
    num_ingresos INTEGER DEFAULT 0,
    num_egresos INTEGER DEFAULT 0,
    
    -- Campos de texto largo
    incidencias TEXT,
    observaciones TEXT,
    
    -- Columna de auditoría (quién y cuándo)
    -- Asume que la tabla 'enfermeros' (de prompts anteriores) existe
    reportado_por_id INTEGER REFERENCES enfermeros(id),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ---
-- 4. Inserción de Datos de Ejemplo
-- ---
-- Basado en la <table> del HTML.

-- Reporte 1 (Piso 1 - Pediatría)
INSERT INTO reportes_diarios (
    fecha_reporte, piso_id, turno, num_ingresos, num_egresos, incidencias, reportado_por_id
)
VALUES (
    '2025-01-15',
    1, -- ID del Piso 1 (Pediatría)
    'matutino',
    12,
    8,
    'Fiebre alta en paciente pediátrico',
    1 -- ID del "Jefe de Piso" (ejemplo)
);

-- Reporte 2 (Piso 2 - Ginecología)
INSERT INTO reportes_diarios (
    fecha_reporte, piso_id, turno, num_ingresos, num_egresos, incidencias, reportado_por_id
)
VALUES (
    '2025-01-15',
    2, -- ID del Piso 2 (Ginecología)
    'vespertino',
    6,
    4,
    'Control prenatal rutinario',
    1 -- ID del "Jefe de Piso" (ejemplo)
);