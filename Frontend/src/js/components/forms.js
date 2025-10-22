// Utilidades para formularios
export function validarFormulario(formulario) {
    let esValido = true;
    const camposRequeridos = formulario.querySelectorAll('[required]');
    
    camposRequeridos.forEach(campo => {
        if (!campo.value.trim()) {
            esValido = false;
            campo.classList.add('is-invalid');
        }
    });
    
    return esValido;
}

export function mostrarMensaje(tipo, mensaje) {
    // Remover mensajes anteriores
    const mensajesAnteriores = document.querySelectorAll('.mensaje-exito, .mensaje-error');
    mensajesAnteriores.forEach(msg => msg.remove());
    
    const divMensaje = document.createElement('div');
    divMensaje.className = tipo === 'success' ? 'mensaje-exito' : 'mensaje-error';
    divMensaje.textContent = mensaje;
    divMensaje.style.display = 'block';
    
    const formulario = document.querySelector('.form-container form');
    formulario.insertBefore(divMensaje, formulario.firstChild);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        divMensaje.remove();
    }, 5000);
}

export function limpiarFormulario(formulario) {
    formulario.reset();
    formulario.querySelectorAll('.is-valid, .is-invalid').forEach(campo => {
        campo.classList.remove('is-valid', 'is-invalid');
    });
    
    const mensajesError = formulario.querySelectorAll('.mensaje-error');
    mensajesError.forEach(msg => msg.remove());
}