// convierte texto a nodo html
const create_node_from_text = (text) => {
    const node = document.createElement('div');
    node.innerHTML = text;
    return node.firstElementChild;
}

// estado inicial
window.current_view = 'home';
let current_lang = 'es';
let global_config = {};
let app_profiles = [];

// trae la traduccion desde python
const fetch_config = async (lang) => {
    const response = await fetch(`?fetch_lang=${lang}`);
    return await response.json();
}

// trae la lista de estudiantes
const fetch_profiles = async () => {
    const response = await fetch(`?profiles=all`);
    return await response.json();
}

// referencias a las vistas
const home_view = document.getElementById('home-view');
const profile_container = document.getElementById('profile-container');

// contenedores de tarjetas
const container_cards = document.getElementById('home-container-cards');
const search_container_list = document.getElementById('search-container-list');

// textos generales
const icon_text = document.getElementById('icon-text');
const footer_text = document.getElementById('footer-text');
const home_title = document.getElementById('home-title');

// elementos del buscador
const input_search = document.getElementById('search-input');
const btn_search = document.getElementById('search-button');
const btn_user_box = document.getElementById('user-box');

// elementos del menu de celulares
const btn_user_menu = document.getElementById("user-menu-icon");
const container_nav_responsive = document.getElementById("container-nav-responsive");
const btn_search_responsive = document.getElementById("search-button-responsive");
const input_search_responsive = document.getElementById("search-input-responsive");
const user_box_title = document.getElementById("user-box-responsive-title");

// crea la tarjeta del html
const create_profile_card = (id, name, image_ext) => {
    const src_img_big = `./data/students/${id}/${id}Big${image_ext}`;
    const src_img_small = `./data/students/${id}/${id}Small${image_ext}`;

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

    // carga el perfil si hacen click (funcion que esta en profile.js)
    card.addEventListener('click', () => load_profile(id));
    return card;
}

// dibuja las tarjetas en el div indicado
const render_profiles = (profiles_data, target_container) => {
    target_container.innerHTML = "";
    profiles_data.forEach(profile => {
        target_container.appendChild(create_profile_card(profile.ci, profile.name, profile.image_ext));
    });
}

// reemplaza los textos con el idioma elegido
const apply_translations = (config) => {
    console.log(config);
    global_config = config;
    home_title.textContent = config.semester;
    footer_text.textContent = config.copyRight;
    btn_search.textContent = config.search;
    input_search.placeholder = config.name + '...';
    icon_text.innerHTML = config.site.join('').replace('[UCV]', '<span>[UCV]</span>');
    icon_text.setAttribute('title', config.home);
    btn_user_box.setAttribute('title', config.profile);

    input_search_responsive.placeholder = config.name + '...';
    btn_search_responsive.textContent = config.search;
    user_box_title.textContent = config.profile;
}

// funcion principal que arranca todo
const init_app = async () => {
    const parameters = new URLSearchParams(window.location.search);
    let lang_param = parameters.get('lang');

    // si piden un idioma en la url, lo guardamos en la "cookie" local y limpiamos la url
    if (lang_param) {
        localStorage.setItem('app_lang', lang_param);
        window.history.replaceState({}, '', window.location.pathname);
    }

    // usamos el idioma guardado o español por defecto
    current_lang = localStorage.getItem('app_lang') || 'es';
    document.documentElement.lang = current_lang;

    const config = await fetch_config(current_lang);
    if (config) {
        apply_translations(config);
    }

    app_profiles = await fetch_profiles();
    if (app_profiles && app_profiles.length > 0) {
        render_profiles(app_profiles, container_cards);
    }

    // verifica si hay un perfil guardado en la sesion del navegador
    const profileId = sessionStorage.getItem('currentProfile');
    const searchQuery = sessionStorage.getItem('searchQuery');

    if (profileId) {
        await load_profile(profileId);
    } else {
        show_home();
    }

    // si habia una busqueda activa, la restauramos
    if (searchQuery) {
        input_search.value = searchQuery;
        input_search_responsive.value = searchQuery;
        handle_search(input_search);
    }
}

// logica para buscar
const handle_search = (input_element) => {
    const text = input_element.value.trim().toLowerCase();

    // si se borra el texto, regresamos a la vista donde estabamos
    if (!text) {
        sessionStorage.removeItem('searchQuery');
        search_container_list.style.display = "none";
        if (window.current_view === 'profile') {
            profile_container.style.display = "";
            home_view.style.display = "none";
        } else {
            profile_container.style.display = "none";
            home_view.style.display = "";
            container_cards.style.display = "";
        }
        return;
    }

    // guardamos la busqueda en memoria
    sessionStorage.setItem('searchQuery', text);

    // ocultamos ambas vistas normales para mostrar los resultados de busqueda
    profile_container.style.display = "none";
    home_view.style.display = "";
    container_cards.style.display = "none";
    search_container_list.style.display = "";

    const filtered = app_profiles.filter(p => p.name.toLowerCase().includes(text));

    if (filtered.length === 0) {
        search_container_list.innerHTML = `<p style="color:blue">No results for <strong>${text}</strong></p>`;
    } else {
        render_profiles(filtered, search_container_list);
    }
}

// eventos de click
icon_text.addEventListener('click', () => show_home()); // funcion que esta en profile.js
btn_search.addEventListener('click', () => handle_search(input_search));
btn_search_responsive.addEventListener('click', () => handle_search(input_search_responsive));

// detectar cuando se vacia el buscador para regresar a la vista anterior 
input_search.addEventListener('input', () => {
    if (input_search.value.trim() === '') handle_search(input_search);
});
input_search_responsive.addEventListener('input', () => {
    if (input_search_responsive.value.trim() === '') handle_search(input_search_responsive);
});

// presionar Enter para buscar
input_search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handle_search(input_search);
});
input_search_responsive.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handle_search(input_search_responsive);
});

// ocultar o mostrar menu en celular
btn_user_menu.addEventListener("click", () => {
    container_nav_responsive.classList.toggle("inset-0");
    container_nav_responsive.classList.toggle("relative");
});

// arreglar el menu si giran la pantalla
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        container_nav_responsive.classList.remove("inset-0");
        container_nav_responsive.classList.remove("relative");
    }
});

init_app();