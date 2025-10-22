import { validarFormulario, mostrarMensaje } from '../components/forms.js';

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('registroEnfermeroForm');
    
    // Configurar validación en tiempo real
    formulario.addEventListener('input', function(e) {
        validarCampo(e.target);
    });
    
    // Manejar envío del formulario
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validarFormulario(formulario)) {
            await enviarFormulario(formulario);
        }
    });
    
    // Validación de campos específicos
    document.getElementById('telCelular').addEventListener('blur', validarTelefono);
    document.getElementById('curp').addEventListener('blur', validarCURP);
    document.getElementById('email').addEventListener('blur', validarEmail);
});

function validarCampo(campo) {
    const valor = campo.value.trim();
    let esValido = true;
    let mensaje = '';
    
    switch(campo.name) {
        case 'nombre':
            if (valor.length < 5) {
                esValido = false;
                mensaje = 'El nombre debe tener al menos 5 caracteres';
            }
            break;
            
        case 'email':
            if (!validarEmail(valor)) {
                esValido = false;
                mensaje = 'Ingrese un email válido';
            }
            break;
            
        case 'telefono':
            if (!validarTelefono(valor)) {
                esValido = false;
                mensaje = 'Ingrese un teléfono válido (10 dígitos)';
            }
            break;
            
        case 'curp':
            if (!validarCURP(valor)) {
                esValido = false;
                mensaje = 'Ingrese una CURP válida';
            }
            break;
            
        case 'cedula_profesional':
            if (valor.length < 5) {
                esValido = false;
                mensaje = 'La cédula debe tener al menos 5 caracteres';
            }
            break;
    }
    
    mostrarEstadoCampo(campo, esValido, mensaje);
    return esValido;
}

function validarTelefono(telefono) {
    const telefonoStr = typeof telefono === 'string' ? telefono : telefono.value || '';
    const regex = /^\d{10}$/;
    return regex.test(telefonoStr.replace(/\D/g, ''));
}

function validarCURP(curp) {
    const curpStr = typeof curp === 'string' ? curp : curp.value || '';
    const regex = /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{2}$/;
    return regex.test(curpStr.toUpperCase());
}

function validarEmail(email) {
    const emailStr = typeof email === 'string' ? email : email.value || '';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
}

function mostrarEstadoCampo(campo, esValido, mensaje) {
    // Remover estados anteriores
    campo.classList.remove('is-invalid', 'is-valid');
    
    // Remover mensaje anterior
    let mensajeError = campo.parentNode.querySelector('.mensaje-error');
    if (!mensajeError) {
        mensajeError = document.createElement('div');
        mensajeError.className = 'mensaje-error';
        campo.parentNode.appendChild(mensajeError);
    }
    
    if (esValido) {
        campo.classList.add('is-valid');
        mensajeError.style.display = 'none';
    } else {
        campo.classList.add('is-invalid');
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
    }
}

async function enviarFormulario(formulario) {
    const boton = formulario.querySelector('button[type="submit"]');
    const datosFormulario = new FormData(formulario);
    
    // Convertir checkboxes de áreas de acceso a array
    const areasAcceso = [];
    formulario.querySelectorAll('input[name="areas_acceso"]:checked').forEach(checkbox => {
        areasAcceso.push(checkbox.value);
    });
    
    const datos = {
        datos_personales: {
            nombre: datosFormulario.get('nombre'),
            email: datosFormulario.get('email'),
            fecha_nacimiento: datosFormulario.get('fecha_nacimiento'),
            curp: datosFormulario.get('curp'),
            telefono: datosFormulario.get('telefono'),
            cedula_profesional: datosFormulario.get('cedula_profesional'),
            direccion: datosFormulario.get('direccion')
        },
        datos_profesionales: {
            puesto: datosFormulario.get('puesto'),
            especialidad: datosFormulario.get('especialidad'),
            fecha_contratacion: datosFormulario.get('fecha_contratacion'),
            tipo_rotacion: datosFormulario.get('tipo_rotacion'),
            supervisor: datosFormulario.get('supervisor')
        },
        datos_sistema: {
            usuario: datosFormulario.get('usuario'),
            contrasena: datosFormulario.get('contrasena'),
            rol_acceso: datosFormulario.get('rol_acceso'),
            areas_acceso: areasAcceso
        },
        comentarios: datosFormulario.get('comentarios')
    };
    
    try {
        boton.disabled = true;
        boton.textContent = 'Registrando...';
        
        const respuesta = await fetch('http://localhost:5000/api/enfermeros/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await respuesta.json();
        
        if (respuesta.ok) {
            mostrarMensaje('success', 'Enfermero registrado exitosamente');
            formulario.reset();
        } else {
            throw new Error(resultado.error || 'Error al registrar enfermero');
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('error', error.message);
    } finally {
        boton.disabled = false;
        boton.textContent = 'Registrar y Activar Cuenta';
    }
}

// Exportar para pruebas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validarTelefono, validarCURP, validarEmail };
}