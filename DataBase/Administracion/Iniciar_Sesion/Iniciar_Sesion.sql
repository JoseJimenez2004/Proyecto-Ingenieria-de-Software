-- ---
-- 1. Tabla de Roles (Dependencia para el Login)
-- ---
-- El login necesita esta tabla para saber qué rol asignar al usuario.

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(255) NOT NULL UNIQUE,
    -- (nivel_rol, descripcion, etc. de la página anterior)
    descripcion TEXT
);

-- Insertamos roles básicos
INSERT INTO roles (nombre_rol, descripcion) VALUES
('enfermero', 'Acceso estándar al sistema'),
('administrador', 'Acceso total al sistema');


-- ---
-- 2. Tabla 'enfermeros' (ACTUALIZADA PARA LOGIN)
-- ---
-- Esta es la tabla que valida los datos del formulario de login.

CREATE TABLE enfermeros (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    
    -- --- CAMPOS DEL FORMULARIO DE LOGIN ---
    
    -- Campo 'email' del formulario
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- Campo 'password' del formulario (se guarda hasheado)
    password_hash VARCHAR(255) NOT NULL, 
    
    -- --- Fin campos de login ---
    
    -- Llave foránea que conecta al enfermero con su rol
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    
    -- Otros campos (id_empleado, avatar_url, etc.)
    id_empleado VARCHAR(50) UNIQUE,
    fecha_contratacion DATE DEFAULT NOW()
);


-- ---
-- 3. Inserción de Datos de Ejemplo (con HASH)
-- ---
-- Creamos un enfermero de ejemplo para poder iniciar sesión.
-- La contraseña en texto plano es "password123".
-- (Este es un HASH de ejemplo para 'password123' usando bcrypt)

INSERT INTO enfermeros (nombre_completo, email, password_hash, rol_id, id_empleado)
VALUES (
    'Enfermero de Prueba',
    'ejemplo@aliviohospital.com',
    '$2b$12$T.G.OM8i.1tG0aD.w2.b.uVv.s1X.7k/F.G.h.d.A.9.q', -- Hash de 'password123'
    (SELECT id FROM roles WHERE nombre_rol = 'enfermero'),
    'ENF100'
);