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

// Función para cargar el perfil del usuario
const load_profile = async (root = "./") => {
    try {
        // Cargar el script de datos de forma dinámica
        await load_new_script(root + id + "/profile.json", type = "text/javascript");

        // Buscar el perfil correspondiente al id obtenido de la URL
        document.title = profile.name;

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
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        profile_container.innerHTML = `<h2 class="error-message">No se pudo cargar el perfil. Por favor, inténtalo de nuevo más tarde.</h2>`;
    }
};



// Variables globales
const icon_text = document.getElementById('icon-text');
const footer_text = document.getElementById('footer-text');
const search_input = document.getElementById('search-input');
const search_button = document.getElementById('search-button');
const user_box = document.getElementById('user-box');


// Configuración de la página a partir del archivo configXX.json
footer_text.textContent = config.copyRight;
search_button.textContent = config.search;
search_input.placeholder = config.name + '...';
icon_text.innerHTML = config.site.toString().replace('[UCV]', '<span>[UCV]</span>').replaceAll(',', '');
icon_text.setAttribute('title', config.home);
user_box.setAttribute('title', config.profile);

icon_text.addEventListener('click', () => window.location.href = './index.html');

// Cargar los perfiles en la página profile
const parameters = new URLSearchParams(window.location.search);
const id = parameters.get('id');
const profile_container = document.getElementById('profile-container');



load_profile();