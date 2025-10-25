class TextoAnimado {
	constructor(id, objetivo){
		this.texto = document.getElementById(id);
		this.objetivo = document.getElementById(objetivo);
		this.letras = this.texto.innerText.split("");
		
		this.texto.innerText = '';

		this.letras.forEach((letra) => {
			let caracter = letra === ' ' ? '&nbsp;' : letra;

			this.texto.innerHTML = this.texto.innerHTML + `
				<div>
					<span>${caracter}</span>
					<span class="segunda-linea">${caracter}</span>
				</div>
			`;
		});

		this.objetivo.addEventListener('mouseenter', () => {
			let cuenta = 0;

			const intervalo = setInterval(() => {
				if(cuenta < this.texto.children.length){
					this.texto.children[cuenta].classList.add('animacion');
					cuenta += 1;
				} else {
					clearInterval(intervalo);
				}
			}, 30);
		});

		this.objetivo.addEventListener('mouseleave', () => {
			let cuenta = 0;

			const intervalo = setInterval(() => {
				if(cuenta < this.texto.children.length){
					this.texto.children[cuenta].classList.remove('animacion');
					cuenta += 1;
				} else {
					clearInterval(intervalo);
				}
			}, 30);
		});
		
	}
}

new TextoAnimado('logo', 'logotipo');


document.addEventListener("DOMContentLoaded", function () {
	const faqItems = document.querySelectorAll(".faq-item");
  
	faqItems.forEach(item => {
	  const question = item.querySelector(".faq-question");
	  const answer = item.querySelector(".faq-answer");
	  const icon = item.querySelector(".faq-icon");
  
	  question.addEventListener("click", () => {
		const isOpen = answer.style.display === "block";
  
		// Cerrar todos
		document.querySelectorAll(".faq-answer").forEach(a => a.style.display = "none");
		document.querySelectorAll(".faq-icon").forEach(i => i.textContent = "+");
  
		// Abrir si no estaba abierto
		if (!isOpen) {
		  answer.style.display = "block";
		  icon.textContent = "−";
		}
	  });
	});
});
  
  
document.addEventListener("DOMContentLoaded", () => {
  const datos = JSON.parse(productos)[0];
  const animales = datos.animales;
  const galeria = document.getElementById("galeria-mascotas");

  const filtroTipo = document.getElementById("filtroTipo");
  const filtroTamano = document.getElementById("filtroTamano");
  const filtroEdad = document.getElementById("filtroEdad");
  const filtroSexo = document.getElementById("filtroSexo");
  const eliminarFiltros = document.getElementById("eliminarFiltros");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  function renderAnimales(lista) {
    galeria.innerHTML = "";

    if (lista.length === 0) {
      galeria.innerHTML = `<p class="text-center">No se encontraron resultados.</p>`;
      return;
    }

    lista.forEach(animal => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("col-sm-12", "col-md-6", "col-lg-4", "mb-4");

      tarjeta.innerHTML = `
        <a href="Animales/Animal1/animal.html?id=${animal.id}" class="text-decoration-none text-dark">
          <div class="producto h-100">
            <h3 class="producto__nombre">${animal.nombre}</h3>
            <img class="producto__imagen" src="${animal.imagen}" alt="${animal.nombre}">
            <p class="producto__precio">${animal.raza} | ${animal.edad} | ${animal.tamano}</p>
            <p class="producto__descripcion">${animal.descripcion}</p>
          </div>
        </a>
      `;

      galeria.appendChild(tarjeta);
    });
  }

  function filtrarAnimales() {
    const tipo = filtroTipo.value.trim().toLowerCase();
    const tamano = filtroTamano.value.trim().toLowerCase();
    const edad = filtroEdad.value.trim();
    const sexo = filtroSexo.value.trim().toLowerCase();
    const textoBusqueda = searchInput.value.trim().toLowerCase();

    let resultado = animales;

    if (tipo) {
      resultado = resultado.filter(a => a.tipo.toLowerCase() === tipo);
    }
    if (tamano) {
      resultado = resultado.filter(a => a.tamano.toLowerCase() === tamano);
    }
    if (edad) {
      resultado = resultado.filter(a => a.edad.startsWith(edad));
    }
    if (sexo) {
      resultado = resultado.filter(a => a.sexo.toLowerCase() === sexo);
    }
    if (textoBusqueda) {
      resultado = resultado.filter(a =>
        a.nombre.toLowerCase().includes(textoBusqueda) ||
        a.raza.toLowerCase().includes(textoBusqueda)
      );
    }

    renderAnimales(resultado);
  }

  // Eventos de filtros
  filtroTipo.addEventListener("change", filtrarAnimales);
  filtroTamano.addEventListener("change", filtrarAnimales);
  filtroEdad.addEventListener("change", filtrarAnimales);
  filtroSexo.addEventListener("change", filtrarAnimales);
  searchButton.addEventListener("click", filtrarAnimales);
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") filtrarAnimales();
  });

  // Botón para limpiar filtros
  eliminarFiltros.addEventListener("click", () => {
    filtroTipo.value = "";
    filtroTamano.value = "";
    filtroEdad.value = "";
    filtroSexo.value = "";
    searchInput.value = "";
    renderAnimales(animales);
  });

  // Render inicial
  renderAnimales(animales);
});
class TextoAnimado {
	constructor(id, objetivo){
		this.texto = document.getElementById(id);
		this.objetivo = document.getElementById(objetivo);
		this.letras = this.texto.innerText.split("");
		
		this.texto.innerText = '';

		this.letras.forEach((letra) => {
			let caracter = letra === ' ' ? '&nbsp;' : letra;

			this.texto.innerHTML = this.texto.innerHTML + `
				<div>
					<span>${caracter}</span>
					<span class="segunda-linea">${caracter}</span>
				</div>
			`;
		});

		this.objetivo.addEventListener('mouseenter', () => {
			let cuenta = 0;

			const intervalo = setInterval(() => {
				if(cuenta < this.texto.children.length){
					this.texto.children[cuenta].classList.add('animacion');
					cuenta += 1;
				} else {
					clearInterval(intervalo);
				}
			}, 30);
		});

		this.objetivo.addEventListener('mouseleave', () => {
			let cuenta = 0;

			const intervalo = setInterval(() => {
				if(cuenta < this.texto.children.length){
					this.texto.children[cuenta].classList.remove('animacion');
					cuenta += 1;
				} else {
					clearInterval(intervalo);
				}
			}, 30);
		});
		
	}
}

new TextoAnimado('logo', 'logotipo');


document.addEventListener("DOMContentLoaded", function () {
	const faqItems = document.querySelectorAll(".faq-item");
  
	faqItems.forEach(item => {
	  const question = item.querySelector(".faq-question");
	  const answer = item.querySelector(".faq-answer");
	  const icon = item.querySelector(".faq-icon");
  
	  question.addEventListener("click", () => {
		const isOpen = answer.style.display === "block";
  
		// Cerrar todos
		document.querySelectorAll(".faq-answer").forEach(a => a.style.display = "none");
		document.querySelectorAll(".faq-icon").forEach(i => i.textContent = "+");
  
		// Abrir si no estaba abierto
		if (!isOpen) {
		  answer.style.display = "block";
		  icon.textContent = "−";
		}
	  });
	});
  });
  
  
