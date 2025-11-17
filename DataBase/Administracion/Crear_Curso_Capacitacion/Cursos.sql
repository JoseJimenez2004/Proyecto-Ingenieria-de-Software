-- ---
-- 1. Tipo de Dato Personalizado (ENUM) para Modalidad
-- ---
-- Esto asegura que solo 'presencial', 'virtual' o 'hibrido'
-- sean valores válidos para la modalidad del curso.

CREATE TYPE tipo_modalidad_curso AS ENUM (
    'presencial',
    'virtual',
    'hibrido'
);


-- ---
-- 2. Tabla Principal de Cursos
-- ---
-- Esta tabla almacena la información general de cada curso.

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre_curso VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    modalidad tipo_modalidad_curso NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    duracion_horas INTEGER, -- Puede ser nulo
    descripcion TEXT, -- Puede ser nulo
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ---
-- 3. Tabla de Materiales del Curso (Relación 1 a N)
-- ---
-- Esta tabla almacena las rutas a los archivos subidos
-- y los vincula con un curso de la tabla 'cursos'.

CREATE TABLE materiales_curso (
    id SERIAL PRIMARY KEY,
    
    -- Llave foránea que se conecta con la tabla 'cursos'
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    
    -- El nombre original del archivo (ej. 'guia_rcp.pdf')
    nombre_archivo VARCHAR(255) NOT NULL,
    
    -- La ruta en el servidor donde se guarda el archivo
    -- (ej. '/uploads/cursos/material_1_guia_rcp.pdf')
    path_archivo TEXT NOT NULL
);

-- ---
-- 4. Inserción de Datos de Ejemplo
-- ---
-- Estos son los 2 cursos que ya aparecen en tu <table> HTML.

-- Curso 1: Cuidados Intensivos
INSERT INTO cursos (nombre_curso, instructor, modalidad, fecha_inicio, fecha_fin, duracion_horas, descripcion)
VALUES (
    'Actualización en Cuidados Intensivos', 
    'Dr. Roberto Mendoza', 
    'presencial', 
    '2025-01-15', 
    '2025-01-20', 
    40, 
    'Curso avanzado para enfermería especializada'
);

-- Curso 2: Primeros Auxilios
INSERT INTO cursos (nombre_curso, instructor, modalidad, fecha_inicio, fecha_fin, duracion_horas, descripcion)
VALUES (
    'Primeros Auxilios Avanzados', 
    'Dra. Ana López', 
    'virtual', 
    '2025-01-22', 
    '2025-01-25', 
    24, 
    'Técnicas de emergencia y RCP'
);

-- Inserción de los materiales (simulados)
-- Suponiendo que el primer curso tiene ID=1 y el segundo ID=2

-- Materiales para el Curso 1 (3 archivos)
INSERT INTO materiales_curso (curso_id, nombre_archivo, path_archivo) VALUES
(1, 'presentacion_uci.pptx', '/uploads/cursos/mat_1_presentacion_uci.pptx'),
(1, 'lectura_complementaria_1.pdf', '/uploads/cursos/mat_1_lectura_1.pdf'),
(1, 'caso_estudio.docx', '/uploads/cursos/mat_1_caso_estudio.docx');

-- Materiales para el Curso 2 (2 archivos)
INSERT INTO materiales_curso (curso_id, nombre_archivo, path_archivo) VALUES
(2, 'manual_rcp_2025.pdf', '/uploads/cursos/mat_2_manual_rcp.pdf'),
(2, 'video_demostracion.mp4', '/uploads/cursos/mat_2_video_demo.mp4');