document.addEventListener('DOMContentLoaded', () => {
    const guardarBtn = document.getElementById('guardar-evidencia');
    const limpiarBtn = document.getElementById('limpiar-form');

    guardarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre-charla').value.trim();
        const fecha = document.getElementById('fecha-charla').value.trim();
        const responsable = document.getElementById('responsable-charla').value.trim();
        const descripcion = document.getElementById('descripcion-charla').value.trim();

        if (!nombre || !fecha || !responsable || !descripcion) {
            alert('Por favor completa todos los campos antes de guardar.');
            return;
        }

        // Aquí podrías hacer un POST a tu API o guardar localmente
        console.log({
            nombre,
            fecha,
            responsable,
            descripcion
        });

        alert('Evidencia registrada correctamente');
        limpiarFormulario();
    });

    limpiarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        limpiarFormulario();
    });

    function limpiarFormulario() {
        document.getElementById('nombre-charla').value = '';
        document.getElementById('fecha-charla').value = '';
        document.getElementById('responsable-charla').value = '';
        document.getElementById('descripcion-charla').value = '';
    }
});
