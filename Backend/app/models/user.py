from app import db
from datetime import datetime
import bcrypt

class Enfermero(db.Model):
    __tablename__ = 'enfermeros'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Datos personales
    nombre_completo = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    curp = db.Column(db.String(18), unique=True, nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    cedula_profesional = db.Column(db.String(20), unique=True, nullable=False)
    direccion = db.Column(db.Text, nullable=False)
    
    # Datos profesionales
    puesto = db.Column(db.String(50), nullable=False)  # base, especialista, jefatura
    especialidad = db.Column(db.String(100))
    fecha_contratacion = db.Column(db.Date, nullable=False)
    tipo_rotacion = db.Column(db.String(20), nullable=False)  # fijo, variable
    supervisor = db.Column(db.String(100), nullable=False, default='Coordinador General de Enfermería')
    
    # Datos del sistema
    usuario = db.Column(db.String(50), unique=True, nullable=False)
    contrasena_hash = db.Column(db.String(255), nullable=False)
    rol_acceso = db.Column(db.String(20), nullable=False)  # base, jefatura, coordinador
    areas_acceso = db.Column(db.JSON)  # Lista de áreas permitidas
    
    # Estado y auditoría
    activo = db.Column(db.Boolean, default=True)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    comentarios = db.Column(db.Text)
    
    def set_password(self, password):
        """Hash y guarda la contraseña"""
        salt = bcrypt.gensalt()
        self.contrasena_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password):
        """Verifica la contraseña"""
        return bcrypt.checkpw(password.encode('utf-8'), self.contrasena_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convierte el objeto a diccionario para JSON"""
        return {
            'id': self.id,
            'datos_personales': {
                'nombre_completo': self.nombre_completo,
                'email': self.email,
                'fecha_nacimiento': self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None,
                'curp': self.curp,
                'telefono': self.telefono,
                'cedula_profesional': self.cedula_profesional,
                'direccion': self.direccion
            },
            'datos_profesionales': {
                'puesto': self.puesto,
                'especialidad': self.especialidad,
                'fecha_contratacion': self.fecha_contratacion.isoformat() if self.fecha_contratacion else None,
                'tipo_rotacion': self.tipo_rotacion,
                'supervisor': self.supervisor
            },
            'datos_sistema': {
                'usuario': self.usuario,
                'rol_acceso': self.rol_acceso,
                'areas_acceso': self.areas_acceso
            },
            'activo': self.activo,
            'fecha_registro': self.fecha_registro.isoformat() if self.fecha_registro else None,
            'comentarios': self.comentarios
        }