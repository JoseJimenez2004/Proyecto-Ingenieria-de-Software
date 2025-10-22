# Funciones de seguridad simplificadas
def required_fields(fields, data):
    """Valida que los campos requeridos estén presentes"""
    missing = [field for field in fields if field not in data or not data[field]]
    return missing