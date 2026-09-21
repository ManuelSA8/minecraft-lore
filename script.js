const archivosCapitulos = [
    './chapters/chap1.json',
    './chapters/chap2.json',
    './chapters/chap3.json',
    './chapters/chap4.json'
];

let historiaCompleta = [];
const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// --- CONTROL DE PANTALLAS ---
const btnComenzar = document.getElementById('btn-comenzar');
const btnVolver = document.getElementById('btn-volver'); // Capturamos el nuevo botón
const pantallaPortada = document.getElementById('portada');
const pantallaLector = document.getElementById('lector');

// Botón de ir al libro
btnComenzar.addEventListener('click', () => {
    pantallaPortada.classList.add('oculto'); 
    pantallaLector.classList.remove('oculto'); 
});

// Botón de volver a la portada
btnVolver.addEventListener('click', () => {
    pantallaLector.classList.add('oculto'); 
    pantallaPortada.classList.remove('oculto'); 
});


// --- LÓGICA DE DATOS ---
async function cargarLore() {
    const listaCapitulos = document.getElementById('lista-capitulos');

    for (let i = 0; i < archivosCapitulos.length; i++) {
        try {
            const respuesta = await fetch(archivosCapitulos[i]);
            if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
            const chapter = await respuesta.json();
            
            historiaCompleta.push(chapter);

            // Creamos el enlace en el panel izquierdo
            const li = document.createElement('li');
            const enlace = document.createElement('a');
            enlace.href = "#";
            enlace.textContent = chapter.title;
            
            enlace.addEventListener('click', (evento) => {
                evento.preventDefault();
                mostrarCapitulo(i);
            });

            li.appendChild(enlace);
            listaCapitulos.appendChild(li);

        } catch (error) {
            console.error(`🚨 Error cargando ${archivosCapitulos[i]}:`, error);
        }
    }

    if (historiaCompleta.length > 0) {
        mostrarCapitulo(0);
    }
}

function mostrarCapitulo(indice) {
    const pantalla = document.getElementById('pantalla-capitulo');
    pantalla.innerHTML = ''; 
    
    const chapter = historiaCompleta[indice];

    // Marcamos el activo en el panel izquierdo
    const enlaces = document.querySelectorAll('.categoria-indice a');
    enlaces.forEach(a => a.classList.remove('capitulo-activo'));
    enlaces[indice].classList.add('capitulo-activo');

    const article = document.createElement('article');

    // Añadimos el texto "Capítulo X" justo encima
    const etiqueta = document.createElement('p');
    etiqueta.className = 'etiqueta-capitulo';
    etiqueta.textContent = `Capítulo ${numerosRomanos[indice] || (indice + 1)}`;
    article.appendChild(etiqueta);

    // El título real del JSON
    const titulo = document.createElement('h2');
    titulo.textContent = chapter.title;
    article.appendChild(titulo);

    // Los párrafos
    chapter.paragraphs.forEach(texto => {
        const parrafo = document.createElement('p');
        parrafo.textContent = texto;
        article.appendChild(parrafo);
    });

    pantalla.appendChild(article);
}

// Iniciamos la descarga de datos en segundo plano mientras el usuario ve la portada
cargarLore();