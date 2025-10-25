var productos = `{
  "reporte_eventos": {
    "metricas_riesgo": {
      "total_eventos_reportados": 125,
      "eventos_criticos_tasa": "12.8%",
      "promedio_eventos_por_turno": "4.2",
      "alerta_infraestructura": "Monitor de UCI falló 3 veces esta semana."
    },
    "distribucion_categoria": [
      { "categoria": "Suministro/Inventario", "conteo": 45 },
      { "categoria": "Falla de Equipo", "conteo": 32 },
      { "categoria": "Seguridad/Visitante", "conteo": 20 },
      { "categoria": "Calidad/Proceso", "conteo": 15 },
      { "categoria": "Documentación", "conteo": 13 }
    ],
    "detalle_eventos": [
      {
        "id": "EVE001",
        "fecha": "2025-10-14",
        "hora": "04:30",
        "area": "UCI",
        "categoria": "Falla de Equipo",
        "gravedad": "Alta",
        "descripcion_breve": "Monitor de signos vitales 4 dejó de funcionar."
      },
      {
        "id": "EVE002",
        "fecha": "2025-10-14",
        "hora": "09:15",
        "area": "Urgencias",
        "categoria": "Suministro/Inventario",
        "gravedad": "Media",
        "descripcion_breve": "Falta de jeringas de 10ml en isla de enfermería."
      },
      {
        "id": "EVE003",
        "fecha": "2025-10-13",
        "hora": "23:00",
        "area": "Piso 1 (Pediatría)",
        "categoria": "Seguridad/Visitante",
        "gravedad": "Media",
        "descripcion_breve": "Familiar de paciente intentó ingresar fuera de horario."
      }
    ]
  }
}`;