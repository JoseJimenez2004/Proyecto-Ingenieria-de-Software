var productos = `
{
  "hospital_meta": {
    "nombre": "Hospital de Alta Especialidad Casa Alivio del Sufrimiento",
    "codigo": "CAS-HAE",
    "estandares_rrhh": {
      "relacion_paciente_enfermero_critico": "1:2.5",
      "relacion_paciente_enfermero_piso": "1:5",
      "cursos_anuales_obligatorios": 2,
      "minimo_aprobacion_cursos": "80%"
    }
  },

  "estructura_hospitalaria": {
    "areas_servicio": [
      {
        "id": 101,
        "nombre": "UCI",
        "tipo": "Crítico",
        "camas_totales": 10,
        "minimo_personal_turno": 4
      },
      {
        "id": 102,
        "nombre": "Urgencias",
        "tipo": "Crítico",
        "cubiculos_totales": 15,
        "minimo_personal_turno": 5
      },
      {
        "id": 103,
        "nombre": "Piso 1 (Pediatría)",
        "tipo": "Hospitalización",
        "camas_totales": 30,
        "minimo_personal_turno": 6
      },
      {
        "id": 104,
        "nombre": "Piso 2 (Ginecología)",
        "tipo": "Hospitalización",
        "camas_totales": 25,
        "minimo_personal_turno": 5
      }
    ]
  }
}
`;