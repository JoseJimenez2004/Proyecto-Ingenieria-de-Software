import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2*np.pi, 200)
y = np.sin(x)

fig, ax = plt.subplots()

ax.plot(x, y, label="sin(x)")

ax.set_title("Ejemplo básico en Matplotlib")
ax.set_xlabel("x (radianes)")
ax.set_ylabel("amplitud")
ax.grid(True)
ax.legend()

plt.show()


x = np.arange(1, 13)
y_2024 = 20 + 2*x + np.random.randn(len(x))
y_2025 = 18 + 2.5*x + np.random.randn(len(x))

fig, ax = plt.subplots()
ax.plot(x, y_2024, marker="o", label="2024")
ax.plot(x, y_2025, marker="s", label="2025")

ax.set_title("Ventas mensuales")
ax.set_xlabel("Mes")
ax.set_ylabel("Unidades")
ax.set_xticks(x)
ax.grid(True)
ax.legend()
plt.show()


rng = np.random.RandomState(42)
x = rng.uniform(0, 10, 120)
y = 1.8*x + 5 + rng.normal(scale=3, size=x.size)

fig, ax = plt.subplots()
ax.scatter(x, y, s=30, alpha=0.8)

ax.set_title("Relación altura vs. peso (ejemplo)")
ax.set_xlabel("Altura")
ax.set_ylabel("Peso")
ax.grid(True)

plt.show()


categorias = ["A", "B", "C", "D"]
valores = [35, 52, 27, 41]

fig, ax = plt.subplots()
x = np.arange(len(categorias))
ax.bar(x, valores)

ax.set_title("Comparación por categoría")
ax.set_xlabel("Categoría")
ax.set_ylabel("Valor")
ax.set_xticks(x)
ax.set_xticklabels(categorias)
ax.grid(axis="y")

for xi, v in zip(x, valores):
    ax.annotate(f"{v}", xy=(xi, v), xytext=(0, 4),
                textcoords="offset points", ha="center")

plt.show()



rng = np.random.RandomState(0)
datos = rng.normal(loc=50, scale=10, size=1000)

fig, ax = plt.subplots()
ax.hist(datos, bins=20, edgecolor="black")

ax.set_title("Distribución de puntajes")
ax.set_xlabel("Puntaje")
ax.set_ylabel("Frecuencia")
ax.grid(axis="y")

plt.show()


# Importar librerías (asumido)
# import matplotlib.pyplot as plt
# import numpy as np

# Generación de datos (Matriz de 8x8 aleatoria)
data_heatmap = np.random.rand(8, 8) 

fig_mapa, ax_mapa = plt.subplots(figsize=(6, 5))

# Usando ax.imshow()
im = ax_mapa.imshow(data_heatmap, cmap='viridis', aspect='auto') 

ax_mapa.set_title('Mapa de Calor (plt.imshow)')
ax_mapa.set_xlabel('Columnas')
ax_mapa.set_ylabel('Filas')
# Es crucial añadir la barra de color para interpretar la magnitud
fig_mapa.colorbar(im, ax=ax_mapa, orientation='vertical')

plt.show()