// Warning: La funcion esta diseñada para retornar un nodo asi que cualquier conjunto de nodos que intente crear debe estar contenido en una etiqueta 
const create_node_from_text = (text) => {
    const node = document.createElement('div');
    node.innerHTML = text;
    return node.firstElementChild;
}

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


const load_scripts = async (root = "./") => {
    try {
        await load_new_script(root + id + "/profile.json", "text/javascript");
        await load_new_script(root + "conf/" + "config" + lang.toUpperCase() + ".json", "text/javascript");

        console.log("Todos los scripts se cargaron en orden.");
    } catch (error) {
        console.error("Error cargando scripts:", error);
        throw error;
    }
}

const show_profile_data = (root = './') => {

    let profile_img_src_small = root + id + "/" + id + "Small" + profile.image_ext;
    let profile_img_src_big = root + id + "/" + id + "Big" + profile.image_ext;
    profile_container.innerHTML = `
                <div class="profile-container-left">
                    <div>
                        <picture>
                            <source media="(max-width: 768px)" srcset="${profile_img_src_small}" class="profile-img" type="image/jpeg" id="profile-img-small">
                            <img src="${profile_img_src_big}" alt="Profile Image" class="profile-img" id="profile-img-big">
                        </picture>
                    </div>
                </div>
                <div class="profile-container-right">
                    <h1 class="profile-title" id="profile-title">${profile.name}</h1>

                    <p class="profile-description" id="profile-description">
                        ${profile.description}
                    </p>

                    <table class="profile-container-feature">
                        <tr class="feature-1">
                            <td id="favorite-color-label">${config.color}: </td>
                            <td id="favorite-color-campus">${profile.color} </td>
                        </tr>
                        <tr class="feature-2">
                            <td id="favorite-book-label">${profile.book.length <= 1 ? config.book[0] : config.book[1]}: </td>
                            <td id="favorite-book-campus">${profile.book.toString().replaceAll(',', ', ')} </td>
                        </tr>
                        <tr class="feature-3">
                            <td id="favorite-music-genre-label">${profile.music.length <= 1 ? config.music[0] : config.music[1]}: </td>
                            <td id="favorite-music-genre-campus">${profile.music.toString().replaceAll(',', ', ')} </td>
                        </tr>
                        <tr class="feature-4">
                            <td id="favorite-video-game-label">${profile.video_game.length <= 1 ? config.video_game[0] : config.video_game[1]}: </td>
                            <td id="favorite-video-game-campus">${profile.video_game.toString().replaceAll(',', ', ')} </td>
                        </tr>

                        <tr class="feature-5">
                            <td id="learned-languages-label">${config.language}: </td>
                            <td id="learned-languages-campus">${profile.language.toString().replaceAll(',', ', ')} </td>
                        </tr>
                    </table>

                    <div class="contact-info">
                        <p>
                            ${config.email.replace('[email]', `<a href="mailto:${profile.email}">${profile.email}</a>`)}
                            
                        </p>

                    </div>
                </div>
            `;
}

// Función para cargar el perfil del usuario
const load_profile = async (lang, root = "./") => {
    try {
        // Cargar el script de datos de forma dinámica
        await load_scripts(root);

        // Configuración de la página a partir del archivo configXX.json
        footer_text.textContent = config.copyRight;
        btn_search.textContent = config.search;
        input_search.placeholder = config.name + '...';
        icon_text.innerHTML = config.site.toString().replace('[UCV]', '<span>[UCV]</span>').replaceAll(',', '');
        icon_text.setAttribute('title', config.home);
        btn_user_box.setAttribute('title', config.profile);
        // title correspodiente al usuario
        document.title = profile.name;

        // configuraciones para buscador resposive
        input_search_responsive.placeholder = config.name + '...';
        btn_search_responsive.textContent = config.search;
        user_box_title.textContent = config.profile;


        // Muestra la informacion del perfil
        show_profile_data(root);

    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        profile_container.innerHTML = `<h2 class="error-message">No se pudo cargar el perfil. Por favor, inténtalo de nuevo más tarde.</h2>`;
    }
};

const search_profile = (text) => {
    return profiles.filter(({ name }) => name.toLowerCase().includes(text.toLowerCase()));
}

const render_profile_searched = (e, input) => {
    const text = input.value.trim().toLowerCase();
    profile_container.style.display = "none";
    container_search_list.style.display = "block"

    if (!text) {
        // Aparece el contenedor del perfil
        profile_container.style.display = "flex";
        profile_container.innerHTML = "";

        // Limpia contenedor de lista de usuarios encontrados
        container_search_list.innerHTML = ``;
        show_profile_data();
        return;
    }

    const list_profile = search_profile(text);

    // Se inserta estructura para mostrar las cards en contenedor auxiliar
    container_search_list.innerHTML = `
        <div class="home-container-title">
            <h2 class="title" id="home-title">${config.semester}</h2>
        </div>
        <div class="home-container-cards" id="search-container-cards">

        </div>`;

    if (list_profile.length === 0) {
        document.getElementById("search-container-cards").innerHTML = `<p style="color:blue">${config.query.replace("[query]", `<strong style="color:inherit">${text}</strong>`)}</p>`;
        return;
    }

    // Renderizamos los resultados
    create_list_profiles(list_profile).forEach(card => {
        document.getElementById("search-container-cards").appendChild(card);
    });
}

const render_restore_profile = (e) => {
    const text = e.target.value.trim().toLowerCase();
    if (!text) {
        // Aparece el contenedor del perfil
        profile_container.style.display = "flex";
        profile_container.innerHTML = "";

        // Limpia contenedor de lista de usuarios encontrados
        container_search_list.innerHTML = ``;
        show_profile_data();
        return;
    }
}


// Variables globales

const icon_text = document.getElementById('icon-text');
const footer_text = document.getElementById('footer-text');
const input_search = document.getElementById('search-input');
const btn_search = document.getElementById('search-button');
const btn_user_box = document.getElementById('user-box');
const container_search_list = document.getElementById("container-search-list");
container_search_list.style.display = "none"

icon_text.addEventListener('click', () => window.location.href = `./index.html?lang=${lang}`);

// Cargar los perfiles en la página profile

const parameters = new URLSearchParams(window.location.search);
const lang = parameters.get('lang')?.toLowerCase() || 'es';
const id = parameters.get('id');
document.documentElement.lang = lang;

const profile_container = document.getElementById('profile-container');


// variables para menu responsive
const btn_user_menu = document.getElementById("user-menu-icon");
const container_nav_responsive = document.getElementById("container-nav-responsive");
const btn_search_responsive = document.getElementById("search-button-responsive");
const input_search_responsive = document.getElementById("search-input-responsive");
const user_box_title = document.getElementById("user-box-responsive-title");


load_profile(lang);

// Logica para renderizar la busqueda en profile
btn_search.addEventListener('click', (e) => render_profile_searched(e, input_search));
btn_search_responsive.addEventListener('click', (e) => render_profile_searched(e, input_search_responsive));

// logica para cuando borras todo el texto en el input
input_search.addEventListener('input', render_restore_profile);
input_search_responsive.addEventListener('input', render_restore_profile);


// logica para mostrar menu responsive
const toggle_class_btn_user = () => {
    container_nav_responsive.classList.toggle("inset-0");
    container_nav_responsive.classList.toggle("relative");
}

const hidden_menu_resposive = (e) => {
    if (window.innerWidth > 768) {
        container_nav_responsive.classList.remove("inset-0");
        container_nav_responsive.classList.remove("relative");
    }
}

btn_user_menu.addEventListener("click", toggle_class_btn_user);

window.addEventListener("resize", hidden_menu_resposive)