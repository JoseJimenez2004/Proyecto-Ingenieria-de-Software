// =========================================================
// reporte_eventos.js (Lógica del Módulo 6950 - Reporte de Eventos)
// CORREGIDO: SE ELIMINA LA VALIDACIÓN ESTRICTA DE FECHAS PARA LA RENDERIZACIÓN INICIAL.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... (Definiciones de elementos HTML omitidas por brevedad) ...
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');
    const areaSelect = document.getElementById('filtroArea');
    const categoriaSelect = document.getElementById('filtroCategoria');
    const generarReporteButton = document.getElementById('generarReporte');
    const limpiarFiltrosButton = document.getElementById('limpiarFiltros');
    const totalEventosCard = document.getElementById('totalEventos');
    const tasaCriticosCard = document.getElementById('tasaCriticos');
    const promedioTurnoCard = document.getElementById('promedioTurno');
    const alertaRiesgoCard = document.getElementById('alertaRiesgo');
    const tablaResultadosBody = document.getElementById('tablaResultadosBody');
    const graficosContainer = document.getElementById('graficosContainer');
    let categoriaChartInstance = null;
    
    // PASO 1: PARSEO DE DATOS GLOBALES (CRUCIAL)
    let eventosData;
    try {
        const dataObjeto = JSON.parse(productos);
        eventosData = dataObjeto.reporte_eventos; 
    } catch (e) {
        console.error("Error al parsear datos del reporte: ", e);
        // Si el parseo falla, el script se detiene aquí.
        return; 
    }

    // --- Event Listener Principal ---
    if (generarReporteButton) {
        generarReporteButton.addEventListener('click', generarReporte);
    }
    if (limpiarFiltrosButton) {
        limpiarFiltrosButton.addEventListener('click', limpiarFiltros);
    }
    
    // LLAMADA INICIAL: Cargar los datos tan pronto como el DOM esté listo
    generarReporte();
    
    // --- LÓGICA DE REPORTE ---

    function generarReporte() {
        // NOTA: La validación estricta de fechas se realiza aquí si fuera necesario
        //       para el backend. Para la simulación, simplemente ignoramos las fechas.
        
        // No necesitamos simular: usamos el objeto ya cargado.
        renderizarTarjetas(eventosData.metricas_riesgo);
        renderizarTablaDetallada(eventosData.detalle_eventos, areaSelect.value, categoriaSelect.value);
        renderizarGrafico(eventosData.distribucion_categoria); 
    }

    // --- Funciones de Renderizado (Sin cambios en el cuerpo) ---

    function renderizarTarjetas(metricas) {
        if (totalEventosCard) totalEventosCard.innerText = metricas.total_eventos_reportados.toLocaleString();
        if (tasaCriticosCard) tasaCriticosCard.innerText = metricas.eventos_criticos_tasa;
        if (promedioTurnoCard) promedioTurnoCard.innerText = metricas.promedio_eventos_por_turno;
        if (alertaRiesgoCard) alertaRiesgoCard.innerText = metricas.alerta_infraestructura;
    }

    function renderizarTablaDetallada(detalle, filtroArea, filtroCategoria) {
        if (!tablaResultadosBody) return; 
        tablaResultadosBody.innerHTML = '';
        
        // Paso clave: Usar los filtros para determinar qué filas mostrar
        const eventosFiltrados = detalle.filter(e => {
            // Ejemplo de lógica de filtro (adaptada a las opciones de los selects)
            const areaMatch = filtroArea === 'todos' || e.area.toUpperCase().includes(filtroArea.split('_')[0].toUpperCase());
            const catMatch = filtroCategoria === 'todos' || e.categoria.toLowerCase().includes(filtroCategoria);
            return areaMatch && catMatch;
        });

        if (eventosFiltrados.length === 0) {
             // Mantiene la estructura de 6 columnas de la imagen
             tablaResultadosBody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron eventos con estos filtros.</td></tr>';
             return;
        }

        // Si hay datos, se llenan las filas
        eventosFiltrados.forEach(evento => {
            const row = tablaResultadosBody.insertRow();
            row.insertCell().textContent = evento.id;
            row.insertCell().textContent = `${evento.fecha} / ${evento.hora}`;
            row.insertCell().textContent = evento.area;
            row.insertCell().textContent = evento.categoria;
            row.insertCell().textContent = evento.gravedad;
            row.insertCell().textContent = evento.descripcion_breve;
        });
    }

    /**
     * Dibuja el gráfico de pastel/doughnut para la distribución de categorías.
     */
    function renderizarGrafico(distribucion) {
        const ctx = document.getElementById('categoriaChart');
        if (!ctx) return;

        if (categoriaChartInstance) {
            categoriaChartInstance.destroy();
        }

        const labels = distribucion.map(d => d.categoria);
        const dataConteo = distribucion.map(d => d.conteo);
        
        // Colores consistentes con la paleta del hospital
        const colores = [
            '#003366', // Azul Sanitario
            '#CC3333', // Rojo Alerta
            '#3CB371', // Verde Salud
            '#6c757d', // Gris Humano
            '#FFA07A'  // Naranja suave
        ];

        categoriaChartInstance = new Chart(ctx, {
            type: 'doughnut', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Conteo de Eventos',
                    data: dataConteo,
                    backgroundColor: colores,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    function limpiarFiltros() {
        fechaInicioInput.value = '';
        fechaFinInput.value = '';
        areaSelect.value = 'todos';
        categoriaSelect.value = 'todos';

        // Destruir el gráfico si existe
        if (categoriaChartInstance) {
            categoriaChartInstance.destroy(); 
            categoriaChartInstance = null;
        }

        // Limpiar la salida y mostrar estado inicial
        renderizarTarjetas({
            total_eventos_reportados: '-',
            eventos_criticos_tasa: '-',
            promedio_eventos_por_turno: '-',
            alerta_infraestructura: 'Esperando datos'
        });
        if(tablaResultadosBody) {
             // Mantiene la estructura de 6 columnas de la imagen
             tablaResultadosBody.innerHTML = '<tr><td colspan="6" class="text-center">Aplique filtros para auditar eventos.</td></tr>';
        }
        if(graficosContainer) {
            // Recrear la estructura del canvas para el siguiente reporte
            graficosContainer.innerHTML = '<h4>Distribución de Eventos por Categoría</h4><div class="chart-container"><canvas id="categoriaChart"></canvas></div>';
        }
    }
});