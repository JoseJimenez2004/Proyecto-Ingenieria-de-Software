-- ---
-- 1. Tabla de Roles del Sistema
-- ---

CREATE TABLE roles_sistema (
    id SERIAL PRIMARY KEY,
    
    -- Información básica del rol
    nombre_rol VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    
    -- Nivel de acceso y permisos
    nivel_acceso INTEGER NOT NULL CHECK (nivel_acceso >= 1 AND nivel_acceso <= 10),
    permisos JSONB NOT NULL DEFAULT '{}',
    
    -- Metadatos del rol
    activo BOOLEAN DEFAULT TRUE,
    color_rol VARCHAR(7) DEFAULT '#6B7280',
    
    -- Campos de auditoría
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por VARCHAR(100) DEFAULT 'sistema'
);

-- ---
-- 2. Tabla de Asignación de Roles a Usuarios
-- ---

CREATE TABLE usuarios_roles (
    id SERIAL PRIMARY KEY,
    
    -- Relaciones
    usuario_id INTEGER NOT NULL, -- Referencia a tabla de usuarios (si existe)
    enfermero_id INTEGER REFERENCES enfermeros(id), -- Referencia opcional a enfermeros
    rol_id INTEGER NOT NULL REFERENCES roles_sistema(id),
    
    -- Información de la asignación
    fecha_asignacion DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_expiracion DATE, -- NULL = sin expiración
    
    -- Estado
    activo BOOLEAN DEFAULT TRUE,
    
    -- Campos de auditoría
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    asignado_por VARCHAR(100) DEFAULT 'sistema',
    
    -- Restricciones
    CONSTRAINT unique_usuario_rol_activo UNIQUE (usuario_id, rol_id) 
        WHERE activo = true,
    CONSTRAINT check_fecha_expiracion_valida 
        CHECK (fecha_expiracion IS NULL OR fecha_expiracion >= fecha_asignacion)
);

-- ---
-- 3. Inserción de Roles Predefinidos
-- ---

INSERT INTO roles_sistema (
    nombre_rol, 
    descripcion, 
    nivel_acceso, 
    permisos,
    color_rol
) VALUES
(
    'Administrador del Sistema',
    'Acceso completo a todas las funcionalidades del sistema, gestión de usuarios y configuración',
    10,
    '{
        "gestion_usuarios": ["crear", "leer", "actualizar", "eliminar"],
        "gestion_roles": ["crear", "leer", "actualizar", "eliminar", "asignar"],
        "gestion_enfermeros": ["crear", "leer", "actualizar", "eliminar"],
        "gestion_cursos": ["crear", "leer", "actualizar", "eliminar", "inscribir"],
        "reportes": ["generar", "exportar", "visualizar"],
        "dashboard": ["acceso_completo"],
        "configuracion": ["modificar"]
    }',
    '#DC2626'
),
(
    'Coordinador de Enfermería',
    'Gestión del personal de enfermería, asignación de turnos y supervisión de actividades',
    8,
    '{
        "gestion_enfermeros": ["crear", "leer", "actualizar"],
        "gestion_turnos": ["crear", "leer", "actualizar", "asignar"],
        "gestion_cursos": ["crear", "leer", "actualizar", "inscribir"],
        "reportes": ["generar", "visualizar"],
        "dashboard": ["acceso_completo"],
        "configuracion": ["modificar_basico"]
    }',
    '#2563EB'
),
(
    'Supervisor de Capacitación',
    'Gestión de cursos de capacitación e inscripciones del personal',
    7,
    '{
        "gestion_cursos": ["crear", "leer", "actualizar", "inscribir"],
        "gestion_inscripciones": ["crear", "leer", "actualizar", "eliminar"],
        "reportes": ["generar", "visualizar"],
        "dashboard": ["acceso_parcial"]
    }',
    '#059669'
),
(
    'Enfermero Senior',
    'Personal de enfermería con experiencia, puede supervisar actividades básicas',
    5,
    '{
        "gestion_turnos": ["leer", "actualizar_propio"],
        "gestion_cursos": ["leer", "inscribirse"],
        "reportes": ["visualizar_propios"],
        "dashboard": ["acceso_parcial"]
    }',
    '#7C3AED'
),
(
    'Enfermero General',
    'Personal de enfermería con acceso básico al sistema',
    3,
    '{
        "gestion_turnos": ["leer_propio"],
        "gestion_cursos": ["leer", "inscribirse"],
        "reportes": ["visualizar_propios"],
        "dashboard": ["acceso_basico"]
    }',
    '#475569'
),
(
    'Recursos Humanos',
    'Gestión de personal, contrataciones y datos administrativos',
    6,
    '{
        "gestion_enfermeros": ["crear", "leer", "actualizar"],
        "gestion_contratos": ["crear", "leer", "actualizar"],
        "reportes": ["generar", "visualizar"],
        "dashboard": ["acceso_parcial"]
    }',
    '#D97706'
);

-- ---
-- 4. Inserción de Ejemplos de Asignación de Roles
-- ---

INSERT INTO usuarios_roles (
    usuario_id,
    enfermero_id,
    rol_id,
    fecha_asignacion,
    asignado_por
) VALUES
-- Administrador principal
(1, NULL, 1, '2024-01-01', 'sistema'),

-- Coordinadores de enfermería
(2, 1, 2, '2024-01-15', 'admin'),
(3, 4, 2, '2024-01-20', 'admin'),

-- Supervisores de capacitación
(4, NULL, 3, '2024-02-01', 'admin'),

-- Enfermeros senior
(5, 6, 4, '2024-01-10', 'coordinador'),
(6, 8, 4, '2024-01-12', 'coordinador'),

-- Enfermeros generales
(7, 2, 5, '2024-01-05', 'coordinador'),
(8, 3, 5, '2024-01-05', 'coordinador'),
(9, 5, 5, '2024-01-05', 'coordinador'),
(10, 7, 5, '2024-01-05', 'coordinador');

-- ---
-- 5. Triggers para Mantener Consistencia
-- ---

-- Trigger para actualizar fecha_actualizacion en roles
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion_roles()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_roles
    BEFORE UPDATE ON roles_sistema
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion_roles();

-- Trigger para desactivar roles asignados cuando se desactiva el rol
CREATE OR REPLACE FUNCTION desactivar_asignaciones_rol()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.activo = false AND OLD.activo = true THEN
        UPDATE usuarios_roles 
        SET activo = false 
        WHERE rol_id = NEW.id AND activo = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_desactivar_asignaciones
    AFTER UPDATE ON roles_sistema
    FOR EACH ROW
    EXECUTE FUNCTION desactivar_asignaciones_rol();

-- ---
-- 6. Vistas Útiles
-- ---

-- Vista para lista de roles con estadísticas
CREATE VIEW vista_roles_completa AS
SELECT 
    rs.id,
    rs.nombre_rol,
    rs.descripcion,
    rs.nivel_acceso,
    rs.permisos,
    rs.activo,
    rs.color_rol,
    rs.fecha_creacion,
    rs.fecha_actualizacion,
    COUNT(ur.id) FILTER (WHERE ur.activo = true) as usuarios_activos,
    COUNT(ur.id) as total_asignaciones
FROM roles_sistema rs
LEFT JOIN usuarios_roles ur ON rs.id = ur.rol_id
GROUP BY rs.id
ORDER BY rs.nivel_acceso DESC;

-- Vista para usuarios con sus roles
CREATE VIEW vista_usuarios_roles AS
SELECT 
    ur.id as asignacion_id,
    ur.usuario_id,
    e.nombre_completo as nombre_enfermero,
    e.id_empleado,
    rs.nombre_rol,
    rs.nivel_acceso,
    rs.permisos,
    ur.fecha_asignacion,
    ur.fecha_expiracion,
    ur.activo as asignacion_activa,
    ur.fecha_creacion
FROM usuarios_roles ur
JOIN roles_sistema rs ON ur.rol_id = rs.id
LEFT JOIN enfermeros e ON ur.enfermero_id = e.id;

-- Vista para permisos consolidados por usuario
CREATE VIEW vista_permisos_usuario AS
SELECT 
    ur.usuario_id,
    ur.enfermero_id,
    jsonb_object_agg(rs.nombre_rol, rs.permisos) as permisos_roles,
    MAX(rs.nivel_acceso) as max_nivel_acceso,
    array_agg(DISTINCT rs.nombre_rol) as roles_asignados
FROM usuarios_roles ur
JOIN roles_sistema rs ON ur.rol_id = rs.id
WHERE ur.activo = true AND rs.activo = true
GROUP BY ur.usuario_id, ur.enfermero_id;

-- ---
-- 7. Funciones Utilitarias
-- ---

-- Función para verificar si un usuario tiene un permiso específico
CREATE OR REPLACE FUNCTION tiene_permiso(
    p_usuario_id INTEGER,
    p_modulo TEXT,
    p_accion TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_permisos JSONB;
BEGIN
    SELECT permisos_roles INTO v_permisos
    FROM vista_permisos_usuario
    WHERE usuario_id = p_usuario_id;
    
    IF v_permisos IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar en cada rol si tiene el permiso
    RETURN EXISTS (
        SELECT 1
        FROM jsonb_each(v_permisos) AS roles(rol_nombre, rol_permisos)
        WHERE rol_permisos -> p_modulo ? p_accion
    );
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el nivel de acceso de un usuario
CREATE OR REPLACE FUNCTION obtener_nivel_acceso(p_usuario_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_nivel INTEGER;
BEGIN
    SELECT max_nivel_acceso INTO v_nivel
    FROM vista_permisos_usuario
    WHERE usuario_id = p_usuario_id;
    
    RETURN COALESCE(v_nivel, 0);
END;
$$ LANGUAGE plpgsql;

-- ---
-- 8. Índices para Mejorar Rendimiento
-- ---

CREATE INDEX idx_roles_activos ON roles_sistema(activo);
CREATE INDEX idx_roles_nivel_acceso ON roles_sistema(nivel_acceso);
CREATE INDEX idx_usuarios_roles_usuario ON usuarios_roles(usuario_id, activo);
CREATE INDEX idx_usuarios_roles_rol ON usuarios_roles(rol_id, activo);
CREATE INDEX idx_usuarios_roles_enfermero ON usuarios_roles(enfermero_id);
CREATE INDEX idx_usuarios_roles_fechas ON usuarios_roles(fecha_asignacion, fecha_expiracion);
CREATE INDEX idx_roles_permisos ON roles_sistema USING GIN (permisos);