from flask import Blueprint, request, jsonify
from app import db
from app.models.user import Enfermero
from datetime import datetime
import bcrypt

enfermeros_bp = Blueprint('enfermeros', __name__)

def validar_datos_enfermero(datos):
    """Función de validación simplificada"""
    errores = []
    
    datos_personales = datos.get('datos_personales', {})
    datos_profesionales = datos.get('datos_profesionales', {})
    datos_sistema = datos.get('datos_sistema', {})
    
    # Validaciones básicas
    if not datos_personales.get('nombre') or len(datos_personales['nombre'].strip()) < 5:
        errores.append('El nombre debe tener al menos 5 caracteres')
    
    if not datos_personales.get('email') or '@' not in datos_personales['email']:
        errores.append('Email inválido')
    
    if not datos_personales.get('telefono') or len(datos_personales['telefono']) != 10:
        errores.append('Teléfono debe tener 10 dígitos')
    
    if not datos_sistema.get('usuario') or len(datos_sistema['usuario']) < 4:
        errores.append('El usuario debe tener al menos 4 caracteres')
    
    return errores

@enfermeros_bp.route('/api/enfermeros/registrar', methods=['POST'])
def registrar_enfermero():
    try:
        datos = request.get_json()
        
        # Validar datos requeridos
        campos_requeridos = ['datos_personales', 'datos_profesionales', 'datos_sistema']
        for campo in campos_requeridos:
            if campo not in datos:
                return jsonify({'error': f'Faltan datos: {campo}'}), 400
        
        datos_personales = datos['datos_personales']
        datos_profesionales = datos['datos_profesionales']
        datos_sistema = datos['datos_sistema']
        
        # Validar campos
        errores = validar_datos_enfermero(datos)
        if errores:
            return jsonify({'error': 'Datos inválidos', 'detalles': errores}), 400
        
        # Verificar duplicados
        if Enfermero.query.filter_by(email=datos_personales['email']).first():
            return jsonify({'error': 'El email ya está registrado'}), 400
        
        if Enfermero.query.filter_by(curp=datos_personales['curp']).first():
            return jsonify({'error': 'La CURP ya está registrada'}), 400
        
        if Enfermero.query.filter_by(usuario=datos_sistema['usuario']).first():
            return jsonify({'error': 'El nombre de usuario ya existe'}), 400
        
        # Crear nuevo enfermero
        nuevo_enfermero = Enfermero(
            nombre_completo=datos_personales['nombre'],
            email=datos_personales['email'],
            fecha_nacimiento=datetime.strptime(datos_personales['fecha_nacimiento'], '%Y-%m-%d').date(),
            curp=datos_personales['curp'],
            telefono=datos_personales['telefono'],
            cedula_profesional=datos_personales['cedula_profesional'],
            direccion=datos_personales['direccion'],
            puesto=datos_profesionales['puesto'],
            especialidad=datos_profesionales.get('especialidad'),
            fecha_contratacion=datetime.strptime(datos_profesionales['fecha_contratacion'], '%Y-%m-%d').date(),
            tipo_rotacion=datos_profesionales['tipo_rotacion'],
            supervisor=datos_profesionales['supervisor'],
            usuario=datos_sistema['usuario'],
            rol_acceso=datos_sistema['rol_acceso'],
            areas_acceso=datos_sistema.get('areas_acceso', [])
        )
        
        # Establecer contraseña
        nuevo_enfermero.set_password(datos_sistema['contrasena'])
        
        # Guardar en base de datos
        db.session.add(nuevo_enfermero)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Enfermero registrado exitosamente',
            'enfermero_id': nuevo_enfermero.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@enfermeros_bp.route('/api/enfermeros/', methods=['GET'])
def api_info():
    return jsonify({
        'mensaje': 'API de Registro de Enfermeros - AlivioHospital',
        'endpoints': {
            'registrar_enfermero': 'POST /api/enfermeros/registrar',
            'listar_enfermeros': 'GET /api/enfermeros',
            'obtener_enfermero': 'GET /api/enfermeros/<id>'
        }
    })

@enfermeros_bp.route('/api/enfermeros', methods=['GET'])
def listar_enfermeros():
    try:
        enfermeros = Enfermero.query.filter_by(activo=True).all()
        return jsonify({
            'enfermeros': [enfermero.to_dict() for enfermero in enfermeros]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error al obtener enfermeros: {str(e)}'}), 500