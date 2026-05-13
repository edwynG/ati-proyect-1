// Warning: La funcion esta diseñada para retornar un nodo asi que cualquier conjunto de nodos que intente crear debe estar contenido en una etiqueta 
const create_node_from_text = (text) => {
    const node = document.createElement('div');
    node.innerHTML = text;
    return node.firstElementChild;
}

// Función para cargar un nuevo script de forma dinámica
const load_new_script = (url, type = "module") => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.type = type;

        // Se ejecuta cuando el script carga con éxito
        script.onload = () => {
            console.log(`Script cargado`);
            resolve(script);
        };

        // Es vital manejar el error por si la URL falla o no hay internet
        script.onerror = () => {
            reject(new Error(`Error al intentar cargar el script: ${url}`));
        };

        document.head.appendChild(script);
    });
};

// Función para crear una tarjeta de perfil a partir de un id, nombre, su extension de imagen y una ruta opcional (por defecto es la raíz del proyecto)
const create_profile_card = (id, name, image_ext, root = "./") => {

    // Tipos de imagenes: jpg, png, webp
    const src_img_big = root + id + "/" + id + "Big" + image_ext;
    const src_img_small = root + id + "/" + id + "Small" + image_ext;

    let card = create_node_from_text(`
            <div class="card">
                <div class="card-top">
                    <div class="card-container-img">
                        <picture class="card-container-img">
                            <source media="(max-width: 768px)" srcset="${src_img_small}" class="card-profile-img">
                            <img src="${src_img_big}" alt="${name}" class="card-profile-img">
                        </picture>
                    </div>
                </div>
                <div class="card-bottom">
                    <h2 class="card-title">${name}</h2>
                </div>
            </div>
    `);

    return card;

}

// Función para crear la lista de perfiles a partir de un array de objetos con nombre e imagen
const create_list_profiles = (profiles) => profiles.map(profile => {
    let card = create_profile_card(profile.ci, profile.name, profile.image_ext);

    // Agregar el evento click a la tarjeta para redirigir a la página de perfil correspondiente
    card.addEventListener('click', () => window.location.href = `./profile.html?id=${profile.ci}&lang=${lang}`)
    return card;
});

const search_profile = (text) => {
    return profiles.filter(({ name }) => name.toLowerCase().includes(text.toLowerCase()));
}

const load_home = async (lang, root = "./") => {
    try {
        // Cargar el script configXX.json de forma dinámica
        await load_new_script(root + "conf/" + "config" + lang.toUpperCase() + ".json", type = "text/javascript");

        // Configuración de la página a partir del archivo configXX.json
        home_title.textContent = config.semester;
        footer_text.textContent = config.copyRight;
        search_button.textContent = config.search;
        search_input.placeholder = config.name + '...';
        icon_text.innerHTML = config.site.toString().replace('[UCV]', '<span>[UCV]</span>').replaceAll(',', '');
        icon_text.setAttribute('title', config.home);
        user_box.setAttribute('title', config.profile);
        document.title = config.site.toString().replaceAll(',', '') + " " + config.semester.split(' ')[1];

        // Cargar los perfiles en la página home
        create_list_profiles(profiles).forEach(card => container_cards.appendChild(card));
    } catch (error) {
        console.error('Error al cargar la página home:', error);
        container_cards.innerHTML = `<h2 class="error-message">No se pudieron cargar los perfiles. Por favor, inténtalo de nuevo más tarde.</h2>`;
    }
}


// Variables globales
const container_cards = document.getElementById('home-container-cards');
const icon_text = document.getElementById('icon-text');
const footer_text = document.getElementById('footer-text');
const home_title = document.getElementById('home-title');
const search_input = document.getElementById('search-input');
const search_button = document.getElementById('search-button');
const user_box = document.getElementById('user-box');


const parameters = new URLSearchParams(window.location.search);
const lang = parameters.get('lang')?.toLowerCase() || 'es';
document.documentElement.lang = lang;

load_home(lang);

// Logica para renderizar la busqueda en profile
search_button.addEventListener('click', () => {
    const text = search_input.value.trim().toLowerCase();

    if (!text) {
        container_cards.innerHTML = "";
        // Cargar los perfiles en la página home
        create_list_profiles(profiles).forEach(card => container_cards.appendChild(card));
        return;
    }

    const list_profile = search_profile(text);
    container_cards.innerHTML = "";

    if (list_profile.length === 0) {
        container_cards.innerHTML = `<p style="color:blue">${config.query.replace("[query]", `<strong style="color:inherit">${text}</strong>`)}</p>`
        return;
    }

    // Renderizamos los resultados
    create_list_profiles(list_profile).forEach(card => {
        container_cards.appendChild(card);
    });
});

// logica para cuando borras todo el texto en el input
search_input.addEventListener('input', (e) => {
    const text = e.target.value.trim().toLowerCase();
    if (!text) {
        container_cards.innerHTML = "";
        // Cargar los perfiles en la página home
        create_list_profiles(profiles).forEach(card => container_cards.appendChild(card));
        return;
    }
});