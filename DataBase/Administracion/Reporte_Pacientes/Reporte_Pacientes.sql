-- ---
-- 1. Tabla de Pisos (Dependencia de reportes anteriores)
-- ---
-- Esta tabla es necesaria para el <select> de pisos y para la tabla de reporte.
CREATE TABLE pisos (
    id SERIAL PRIMARY KEY,
    numero_piso INTEGER NOT NULL UNIQUE,
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
-- 2. Tabla de Camas (Nueva)
-- ---
-- Define el inventario de camas y su ubicación.
CREATE TYPE estado_cama_enum AS ENUM (
    'disponible',
    'ocupada',
    'mantenimiento',
    'limpieza'
);

CREATE TABLE camas (
    id SERIAL PRIMARY KEY,
    -- ej. 101-A, 101-B
    identificador_cama VARCHAR(50) NOT NULL,
    
    -- Llave foránea que conecta la cama con el piso
    piso_id INTEGER NOT NULL REFERENCES pisos(id),
    
    -- Estado actual de la cama
    estado estado_cama_enum NOT NULL DEFAULT 'disponible',
    
    -- Constraint para asegurar que el identificador de cama sea único por piso
    CONSTRAINT unique_cama_piso UNIQUE (identificador_cama, piso_id)
);

-- Insertar camas de ejemplo (ej. 10 camas para Piso 1)
INSERT INTO camas (identificador_cama, piso_id) VALUES
('P1-101A', 1), ('P1-101B', 1), ('P1-102A', 1), ('P1-102B', 1),
('P1-103A', 1), ('P1-103B', 1), ('P1-104A', 1), ('P1-104B', 1),
('P1-105A', 1), ('P1-105B', 1);

-- Insertar camas de ejemplo (ej. 8 camas para Piso 2)
INSERT INTO camas (identificador_cama, piso_id) VALUES
('P2-201A', 2), ('P2-201B', 2), ('P2-202A', 2), ('P2-202B', 2),
('P2-203A', 2), ('P2-203B', 2), ('P2-204A', 2), ('P2-204B', 2);


-- ---
-- 3. Tabla de Pacientes (Nueva)
-- ---
-- Información demográfica básica del paciente.
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    nss VARCHAR(50) UNIQUE, -- Número de Seguridad Social
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- (Otros datos: curp, direccion, etc. que vendrían de un formulario de admisión)
);

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (nombre_completo, nss, fecha_nacimiento) VALUES
('Juan Pérez', '123456789-0', '1980-01-01'),
('Ana Gómez', '098765432-1', '1992-03-15'),
('Luis Martínez', '111222333-4', '2010-07-20');


-- ---
-- 4. Tabla de Admisiones (Transaccional)
-- ---
-- Esta tabla une Pacientes y Camas. Es la fuente principal del reporte.
-- Cada fila es una hospitalización.
CREATE TABLE admisiones (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
    cama_id INTEGER NOT NULL REFERENCES camas(id),
    
    -- Asume que la tabla 'enfermeros' existe
    enfermero_id_ingreso INTEGER REFERENCES enfermeros(id), 
    
    fecha_ingreso TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Si fecha_egreso es NULL, el paciente sigue hospitalizado.
    fecha_egreso TIMESTAMP WITH TIME ZONE,
    
    diagnostico_inicial TEXT,
    
    -- Asegura que una cama 'ocupada' no pueda tener dos pacientes al mismo tiempo
    CONSTRAINT unique_cama_activa UNIQUE (cama_id, fecha_egreso)
);

-- Simular 3 admisiones activas (pacientes hospitalizados)
-- Asignar pacientes a camas y marcar esas camas como 'ocupada'

-- Paciente 1 (Juan Pérez) en Cama 1 (P1-101A)
INSERT INTO admisiones (paciente_id, cama_id, diagnostico_inicial)
VALUES (1, 1, 'Neumonía');
UPDATE camas SET estado = 'ocupada' WHERE id = 1;

-- Paciente 2 (Ana Gómez) en Cama 11 (P2-201A)
INSERT INTO admisiones (paciente_id, cama_id, diagnostico_inicial)
VALUES (2, 11, 'Parto programado');
UPDATE camas SET estado = 'ocupada' WHERE id = 11;

-- Paciente 3 (Luis Martínez) en Cama 2 (P1-101B)
INSERT INTO admisiones (paciente_id, cama_id, diagnostico_inicial)
VALUES (3, 2, 'Fractura de tibia');
UPDATE camas SET estado = 'ocupada' WHERE id = 2;