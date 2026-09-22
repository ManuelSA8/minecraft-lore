// --- CONFIGURACIÓN MAESTRA ---
const loreConfig = [
    {
        id: 'chapters',
        title: 'Capítulos',
        labelPrefix: 'Capítulo',
        useRoman: true,
        files: [
            './chapters/chap1.json',
            './chapters/chap2.json',
            './chapters/chap3.json',
            './chapters/chap4.json'
        ]
    },
    {
        id: 'characters',
        title: 'Personajes',
        labelPrefix: '', 
        useRoman: false,
        files: []
    },
    {
        id: 'locations',
        title: 'Lugares',
        labelPrefix: '',
        useRoman: false,
        files: []
    }
];

let storyData = {}; 
const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// --- CONTROL DE PANTALLAS ---
const btnStart = document.getElementById('btn-start');
const btnBack = document.getElementById('btn-back');
const coverScreen = document.getElementById('cover-screen');
const readerScreen = document.getElementById('reader-screen');

btnStart.addEventListener('click', () => {
    coverScreen.classList.add('hidden'); 
    readerScreen.classList.remove('hidden'); 
});

btnBack.addEventListener('click', () => {
    readerScreen.classList.add('hidden'); 
    coverScreen.classList.remove('hidden'); 
});

// --- LÓGICA DE CARGA DINÁMICA ---
async function loadLore() {
    const sidebarNav = document.getElementById('sidebar-nav');

    for (const category of loreConfig) {
        
        storyData[category.id] = [];

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'index-category';
        
        const h3 = document.createElement('h3');
        h3.textContent = category.title;
        categoryDiv.appendChild(h3);
        
        const ul = document.createElement('ul');
        categoryDiv.appendChild(ul);
        sidebarNav.appendChild(categoryDiv);

        if (category.files.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<span class="coming-soon">Próximamente...</span>';
            ul.appendChild(li);
            continue; // Siguiente categoría
        }

        for (let i = 0; i < category.files.length; i++) {
            try {
                const response = await fetch(category.files[i]);
                if (!response.ok) throw new Error(`Error ${response.status}`);
                const data = await response.json();
                
                storyData[category.id].push(data);

                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = "#";
                link.textContent = data.title;
                
                // Evento para mostrar este contenido en concreto
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    showContent(category.id, i, link);
                });

                li.appendChild(link);
                ul.appendChild(li);

            } catch (error) {
                console.error(`Error cargando ${category.files[i]}:`, error);
            }
        }
    }

    // Mostrar el "Capítulo I" por defecto (de moment, TODO)
    if (storyData['chapters'] && storyData['chapters'].length > 0) {
        const firstLink = sidebarNav.querySelector('a');
        showContent('chapters', 0, firstLink);
    }
}

// --- RENDERIZADO DE CONTENIDO ---
function showContent(categoryId, itemIndex, activeLinkElement) {
    const display = document.getElementById('chapter-display');
    display.innerHTML = ''; 
    
    const content = storyData[categoryId][itemIndex];
    
    const config = loreConfig.find(c => c.id === categoryId);

    document.querySelectorAll('.index-category a').forEach(link => {
        link.classList.remove('active-chapter');
    });
    if (activeLinkElement) {
        activeLinkElement.classList.add('active-chapter');
    }

    const article = document.createElement('article');

    // Etiqueta
    const label = document.createElement('p');
    label.className = 'chapter-label';
    if (config.useRoman) {
        label.textContent = `${config.labelPrefix} ${romanNumerals[itemIndex] || (itemIndex + 1)}`;
    } else {
        label.textContent = config.labelPrefix;
    }
    article.appendChild(label);

    // Título principal
    const title = document.createElement('h2');
    title.textContent = content.title;
    article.appendChild(title);

    // Párrafos
    content.paragraphs.forEach(text => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        article.appendChild(paragraph);
    });

    display.appendChild(article);
}

// Iniciar la carga
loadLore();