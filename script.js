const archivosCapitulos = [
    './chapters/chap1.json',
    './chapters/chap2.json',
    './chapters/chap3.json',
    './chapters/chap4.json'
];

async function cargarLore() {
    const contenedor = document.getElementById('lore-container');

    // --- 1. CREAMOS EL ÍNDICE AL PRINCIPIO ---
    const navIndice = document.createElement('nav');
    navIndice.id = 'indice-capitulos';
    
    const tituloIndice = document.createElement('h2');
    tituloIndice.textContent = 'Índice de Leyendas';
    navIndice.appendChild(tituloIndice);

    const listaIndice = document.createElement('ul');
    navIndice.appendChild(listaIndice);

    // Lo inyectamos en el HTML antes de cargar los textos
    contenedor.appendChild(navIndice);

    // Un separador para dividir el índice del primer capítulo
    contenedor.appendChild(document.createElement('hr'));


    // --- 2. CARGAMOS LOS CAPÍTULOS ---
    // Usamos un bucle tradicional (let i = 0...) para saber por qué número de capítulo vamos
    for (let i = 0; i < archivosCapitulos.length; i++) {
        const respuesta = await fetch(archivosCapitulos[i]);
        const chapter = await respuesta.json();

        // Creamos un identificador único, ej: "capitulo-1"
        const idAncla = `capitulo-${i + 1}`;

        // Añadimos el enlace de este capítulo a la lista del índice
        const li = document.createElement('li');
        const enlace = document.createElement('a');
        enlace.href = `#${idAncla}`; // Esto hace que el enlace baje hasta el id
        enlace.textContent = chapter.title;
        
        li.appendChild(enlace);
        listaIndice.appendChild(li);

        // Creamos el artículo y LE PONEMOS EL ID para que el enlace lo encuentre
        const article = document.createElement('article');
        article.id = idAncla; 

        // Creamos el título
        const titulo = document.createElement('h2');
        titulo.textContent = chapter.title;
        article.appendChild(titulo);

        // Recorremos los párrafos
        chapter.paragraphs.forEach(texto => {
            const parrafo = document.createElement('p');
            parrafo.textContent = texto;
            article.appendChild(parrafo);
        });

        // Añadimos el capítulo al contenedor principal
        contenedor.appendChild(article);
        
        // Añadimos un separador (excepto si es el último capítulo)
        if (i < archivosCapitulos.length - 1) {
            const separador = document.createElement('hr');
            contenedor.appendChild(separador);
        }
    }
}

cargarLore();