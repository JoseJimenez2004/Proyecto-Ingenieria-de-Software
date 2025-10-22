import re
from datetime import datetime

def validar_email(email):
    """Valida formato de email"""
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(patron, email) is not None

def validar_telefono(telefono):
    """Valida formato de teléfono (10 dígitos)"""
    return re.match(r'^\d{10}$', telefono) is not None

def validar_curp(curp):
    """Valida formato básico de CURP"""
    patron = r'^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{2}$'
    return re.match(patron, curp.upper()) is not None

def validar_fecha_futura(fecha_str):
    """Valida que la fecha no sea futura"""
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        return fecha <= datetime.now().date()
    except ValueError:
        return False

def validar_edad_minima(fecha_nacimiento_str, edad_minima=18):
    """Valida edad mínima"""
    try:
        fecha_nacimiento = datetime.strptime(fecha_nacimiento_str, '%Y-%m-%d').date()
        hoy = datetime.now().date()
        edad = hoy.year - fecha_nacimiento.year - ((hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
        return edad >= edad_minima
    except ValueError:
        return False

def validar_datos_enfermero(datos):
    """Valida todos los datos del enfermero"""
    errores = []
    
    datos_personales = datos.get('datos_personales', {})
    datos_profesionales = datos.get('datos_profesionales', {})
    datos_sistema = datos.get('datos_sistema', {})
    
    # Validar datos personales
    if not datos_personales.get('nombre') or len(datos_personales['nombre'].strip()) < 5:
        errores.append('El nombre debe tener al menos 5 caracteres')
    
    if not validar_email(datos_personales.get('email', '')):
        errores.append('Email inválido')
    
    if not validar_telefono(datos_personales.get('telefono', '')):
        errores.append('Teléfono debe tener 10 dígitos')
    
    if not validar_curp(datos_personales.get('curp', '')):
        errores.append('CURP inválida')
    
    if not datos_personales.get('cedula_profesional') or len(datos_personales['cedula_profesional']) < 5:
        errores.append('Cédula profesional inválida')
    
    if not datos_personales.get('direccion') or len(datos_personales['direccion'].strip()) < 10:
        errores.append('La dirección debe tener al menos 10 caracteres')
    
    # Validar fechas
    if not validar_edad_minima(datos_personales.get('fecha_nacimiento', '')):
        errores.append('El enfermero debe ser mayor de 18 años')
    
    if not validar_fecha_futura(datos_profesionales.get('fecha_contratacion', '')):
        errores.append('La fecha de contratación no puede ser futura')
    
    # Validar datos del sistema
    if not datos_sistema.get('usuario') or len(datos_sistema['usuario']) < 4:
        errores.append('El usuario debe tener al menos 4 caracteres')
    
    if not datos_sistema.get('contrasena') or len(datos_sistema['contrasena']) < 6:
        errores.append('La contraseña debe tener al menos 6 caracteres')
    
    return errores