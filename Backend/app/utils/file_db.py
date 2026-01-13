import os
import json
from datetime import datetime


def get_repo_root():
    # Desde Backend/app/utils/... subir tres niveles para llegar al root del repo
    here = os.path.dirname(__file__)
    repo_root = os.path.abspath(os.path.join(here, '..', '..', '..'))
    return repo_root


def save_enfermero_to_file(enfermero_data):
    """Guarda un registro de enfermero en formato JSON (una línea por registro)

    El archivo se coloca en DataBase/Administracion/Registrar_Enfermeros/enfermeros_sim.txt
    """
    repo_root = get_repo_root()
    target_dir = os.path.join(repo_root, 'DataBase', 'Administracion', 'Registrar_Enfermeros')
    os.makedirs(target_dir, exist_ok=True)

    file_path = os.path.join(target_dir, 'enfermeros_sim.txt')

    # Añadir timestamp y escribir JSON en una línea
    registro = dict(enfermero_data)
    registro['_guardado_en'] = datetime.utcnow().isoformat() + 'Z'

    with open(file_path, 'a', encoding='utf-8') as f:
        f.write(json.dumps(registro, ensure_ascii=False) + '\n')

    return file_path
+
+
+def read_enfermeros_file(limit=100):
+    """Lee las últimas `limit` entradas del archivo de simulación y las devuelve como lista de diccionarios."""
+    repo_root = get_repo_root()
+    file_path = os.path.join(repo_root, 'DataBase', 'Administracion', 'Registrar_Enfermeros', 'enfermeros_sim.txt')
+    if not os.path.exists(file_path):
+        return []
+
+    registros = []
+    with open(file_path, 'r', encoding='utf-8') as f:
+        for line in f:
+            if not line.strip():
+                continue
+            try:
+                registros.append(json.loads(line))
+            except Exception:
+                # Ignorar líneas inválidas
+                continue
+
+    return registros[-limit:]

