// =========================================================
// animales.js (Lógica del Módulo 6952 - Reporte de Pacientes)
// Contiene la lógica para dibujar el gráfico de barras con Chart.js.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Elementos del Panel de Control (Input) ---
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');
    const periodicidadSelect = document.getElementById('filtroPeriodicidad');
    const areaSelect = document.getElementById('filtroArea');
    const flujoSelect = document.getElementById('filtroFlujo');
    const generarReporteButton = document.getElementById('generarReporte');
    const limpiarFiltrosButton = document.getElementById('limpiarFiltros');

    // --- 2. Elementos de Salida (Métricas y Tabla) ---
    const totalAtendidosCard = document.getElementById('totalAtendidos');
    const ocupacionPromedioCard = document.getElementById('ocupacionPromedio');
    const depPromedioCard = document.getElementById('depPromedio');
    const alertaRrhhCard = document.getElementById('alertaRrhh');
    const tablaResultadosBody = document.getElementById('tablaResultadosBody');
    const graficosContainer = document.getElementById('graficosContainer');

    let ocupacionChartInstance = null; // Variable para controlar la instancia de Chart.js

    // --- Event Listener Principal ---
    if (generarReporteButton) {
        generarReporteButton.addEventListener('click', generarReporte);
    }
    if (limpiarFiltrosButton) {
        limpiarFiltrosButton.addEventListener('click', limpiarFiltros);
    }
    
    // --- LÓGICA DE SIMULACIÓN Y REPORTE ---

    function generarReporte() {
        const inicio = fechaInicioInput.value;
        const fin = fechaFinInput.value;
        const periodicidad = periodicidadSelect.value;
        const area = areaSelect.value;

        if (!inicio || !fin) {
            alert("Por favor, seleccione un Rango de Fechas válido.");
            return;
        }

        const resultados = simularCalculoDeReporte(periodicidad, area);
        
        renderizarTarjetas(resultados.metricas);
        renderizarTablaDetallada(resultados.detalle);
        renderizarGrafico(resultados.detalle, periodicidad); 
    }

    function simularCalculoDeReporte(periodicidad, area) {
        // La lógica de simulación determina las métricas basadas en el área y la periodicidad
        const ocupacionBase = (area === 'uci' || area === 'urgencias') ? 0.90 : 0.75; 
        const depBase = area === 'urgencias' ? 0.5 : 4.5; 

        // Definición de las métricas de gestión
        const metricas = {
            total_pacientes_atendidos: Math.floor(Math.random() * 500) + 500,
            ocupacion_promedio: `${(ocupacionBase * 100).toFixed(0)}%`,
            dep_promedio: `${(depBase + Math.random() * 1).toFixed(1)} días`,
            alerta_rrhh: (ocupacionBase > 0.85) ? "Refuerzo Necesario" : "Cobertura Óptima"
        };

        // Definición de la tabla y datos para el gráfico
        const detalle = [];
        const numGrupos = 6;
        const labels = {
            'dia': ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6'],
            'semana': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
            'mes': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
        }[periodicidad] || ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

        for (let i = 0; i < numGrupos; i++) {
            detalle.push({
                periodo: labels[i],
                ingresos: Math.floor(Math.random() * 100) + 100,
                ocupacion_valor: Math.random() * 20 + 75, // Valor de ocupación para el gráfico
                dep: (Math.random() * 2 + depBase).toFixed(1),
                relacion_enfermero: `1:${(Math.random() * 0.5 + 2.5).toFixed(1)}`
            });
        }

        return { metricas, detalle };
    }

    // --- Función CLAVE para dibujar el gráfico de barras ---
    function renderizarGrafico(detalle, periodicidad) {
        const ctx = document.getElementById('ocupacionChart');
        if (!ctx) return;

        // 1. Destruir la instancia anterior si existe para evitar errores
        if (ocupacionChartInstance) {
            ocupacionChartInstance.destroy();
        }

        // 2. Preparar datos
        const labels = detalle.map(d => d.periodo);
        const dataOcupacion = detalle.map(d => d.ocupacion_valor);

        // 3. Configuración del gráfico
        ocupacionChartInstance = new Chart(ctx, {
            type: 'bar', // Tipo de gráfico de barras
            data: {
                labels: labels, // Eje X: Períodos (Día, Semana, Mes)
                datasets: [{
                    label: 'Ocupación Promedio (%)',
                    data: dataOcupacion,
                    backgroundColor: 'rgba(0, 51, 102, 0.8)', // Azul Sanitario
                    borderColor: 'rgba(0, 51, 102, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100, // Máximo 100% de ocupación
                        title: {
                            display: true,
                            text: 'Tasa de Ocupación (%)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Ocupación por ${periodicidad.toUpperCase()}`
                    }
                }
            }
        });
    }

    // --- Funciones de Renderizado de Métricas y Tabla ---
    function renderizarTarjetas(metricas) {
        if (totalAtendidosCard) totalAtendidosCard.innerText = metricas.total_pacientes_atendidos.toLocaleString();
        if (ocupacionPromedioCard) ocupacionPromedioCard.innerText = metricas.ocupacion_promedio;
        if (depPromedioCard) depPromedioCard.innerText = metricas.dep_promedio;
        if (alertaRrhhCard) alertaRrhhCard.innerText = metricas.alerta_rrhh;
    }

    function renderizarTablaDetallada(detalle) {
        if (!tablaResultadosBody) return; 
        tablaResultadosBody.innerHTML = '';
        
        detalle.forEach(fila => {
            const row = tablaResultadosBody.insertRow();
            row.insertCell().textContent = fila.periodo;
            row.insertCell().textContent = fila.ingresos.toLocaleString();
            row.insertCell().textContent = `${fila.ocupacion_valor.toFixed(0)}%`; 
            row.insertCell().textContent = fila.dep;
            row.insertCell().textContent = fila.relacion_enfermero;
        });
    }

    function limpiarFiltros() {
        fechaInicioInput.value = '';
        fechaFinInput.value = '';
        periodicidadSelect.value = 'dia'; 
        areaSelect.value = 'todos';
        flujoSelect.value = 'todos';

        // Destruir el gráfico si existe
        if (ocupacionChartInstance) {
            ocupacionChartInstance.destroy(); 
            ocupacionChartInstance = null;
        }

        // Limpiar la salida de métricas
        renderizarTarjetas({
            total_pacientes_atendidos: '-',
            ocupacion_promedio: '-',
            dep_promedio: '-',
            alerta_rrhh: 'Esperando datos'
        });
        if(tablaResultadosBody) {
             tablaResultadosBody.innerHTML = '<tr><td colspan="5" class="text-center">Aplique filtros para generar el reporte.</td></tr>';
        }
        if(graficosContainer) {
            // Vuelve a crear la estructura del canvas para el siguiente reporte
            graficosContainer.innerHTML = '<h4>Gráfico de Tendencia de Ocupación</h4><div class="chart-container"><canvas id="ocupacionChart"></canvas></div>';
        }
        console.log("Filtros y resultados limpiados.");
    }
    
    // NOTA: El código de TextoAnimado y FAQ debe estar aquí si se usa en otras páginas.
});