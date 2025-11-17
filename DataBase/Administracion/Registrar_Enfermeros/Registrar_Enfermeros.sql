-- ---
-- 1. Tipos de Dato Personalizados (ENUM)
-- ---
-- Para los campos <select> con valores fijos

CREATE TYPE tipo_puesto_enum AS ENUM (
    'base',
    'especialista',
    'jefatura'
);

CREATE TYPE tipo_rotacion_enum AS ENUM (
    'fijo',
    'variable'
);

-- ---
-- 2. Tabla de Roles (Dependencia)
-- ---
-- Basada en el <select name="rol_acceso">

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    -- Usamos los 'value' del select
    nombre_rol VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Insertamos los roles del formulario
INSERT INTO roles (nombre_rol) VALUES
('base'),       -- Enfermero Base
('jefatura'),   -- Jefatura/Líder
('coordinador'); -- Coordinador


-- ---
-- 3. Tabla Principal 'enfermeros'
-- ---
-- Esta tabla contiene todos los campos del formulario de registro.

CREATE TABLE enfermeros (
    id SERIAL PRIMARY KEY,
    
    -- Sección I: Datos Personales
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    curp VARCHAR(18) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    cedula_profesional VARCHAR(50) NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    
    -- Sección II: Datos Profesionales
    puesto tipo_puesto_enum NOT NULL,
    especialidad VARCHAR(255), -- Nulo, no es requerido
    fecha_contratacion DATE NOT NULL,
    tipo_rotacion tipo_rotacion_enum NOT NULL,
    supervisor VARCHAR(255),
    
    -- Sección III: Datos del Sistema (Login)
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Para name="contrasena"
    
    -- Llave foránea que se conecta con la tabla 'roles'
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    
    -- Para los checkboxes 'areas_acceso'
    areas_acceso TEXT[] -- Tipo Array de Texto de PostgreSQL
);


-- ---
-- 4. Inserción de Datos de Ejemplo
-- ---
-- Ejemplo de registro para "María García López" (del placeholder)
-- La contraseña es "password123" (hasheada con bcrypt)

INSERT INTO enfermeros (
    nombre_completo, email, fecha_nacimiento, curp, telefono, cedula_profesional, direccion,
    puesto, especialidad, fecha_contratacion, tipo_rotacion, supervisor,
    username, password_hash, rol_id, areas_acceso
)
VALUES (
    'María García López',
    'mgarcia@aliviohospital.com',
    '1990-05-15',
    'GALM900515HDFRPR01',
    '55 1234 5678',
    '7654321',
    'Calle Ficticia 123, Colonia Centro, Ciudad de México, 06000',
    'especialista',
    'Pediatría',
    '2024-10-01',
    'fijo',
    'Coordinador General de Enfermería',
    'mgarcia',
    '$2b$12$T.G.OM8i.1tG0aD.w2.b.uVv.s1X.7k/F.G.h.d.A.9.q', -- Hash de 'password123'
    (SELECT id FROM roles WHERE nombre_rol = 'jefatura'),
    ARRAY['urgencias', 'pediatria'] -- Ejemplo de áreas de acceso
);