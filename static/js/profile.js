// trae los datos del estudiante
const fetch_student = async (studentId) => {
    const response = await fetch(`?student=${studentId}`);
    return await response.json();
}

// muestra el perfil individual
const load_profile = async (studentId) => {
    const student_data = await fetch_student(studentId);
    if (!student_data) return;

    window.current_view = 'profile';

    // cambia de pantalla (estas variables vienen de index.js)
    home_view.style.display = "none";
    profile_container.style.display = "";
    search_container_list.style.display = "none";
    input_search.value = "";
    input_search_responsive.value = "";
    sessionStorage.removeItem('searchQuery');

    // devuelve el scroll al inicio
    window.scrollTo(0, 0);

    const img_small = `./data/students/${studentId}/${studentId}Small${student_data.image_ext}`;
    const img_big = `./data/students/${studentId}/${studentId}Big${student_data.image_ext}`;

    let book_label = student_data.book.length <= 1 ? global_config.book[0] : global_config.book[1];
    let music_label = student_data.music.length <= 1 ? global_config.music[0] : global_config.music[1];
    let video_label = student_data.video_game.length <= 1 ? global_config.video_game[0] : global_config.video_game[1];

    profile_container.innerHTML = `
        <div class="profile-container-left">
            <div class="profile-picture-wrapper">
                <picture>
                    <source media="(max-width: 768px)" srcset="${img_small}" class="profile-img">
                    <img src="${img_big}" alt="${student_data.name}" class="profile-img">
                </picture>
            </div>
        </div>
        <div class="profile-container-right">
            <h1 class="profile-title">${student_data.name}</h1>
            <p class="profile-description">${student_data.description}</p>
            <table class="profile-container-feature">
                <tr><td>${global_config.color}:</td><td>${student_data.color}</td></tr>
                <tr><td>${book_label}:</td><td>${student_data.book.join(', ')}</td></tr>
                <tr><td>${music_label}:</td><td>${student_data.music.join(', ')}</td></tr>
                <tr><td>${video_label}:</td><td>${student_data.video_game.join(', ')}</td></tr>
                <tr><td>${global_config.language}:</td><td>${student_data.language.join(', ')}</td></tr>
            </table>
            <div class="contact-info">
                <p><a href="mailto:${student_data.email}">${student_data.email}</a></p>
            </div>
        </div>
    `;
    document.title = student_data.name;

    // guarda el estado en sessionStorage
    sessionStorage.setItem('currentProfile', studentId);
}

// vuelve a la pantalla inicial
const show_home = () => {
    window.current_view = 'home';
    profile_container.style.display = "none";
    profile_container.innerHTML = "";
    home_view.style.display = "";
    container_cards.style.display = "";
    search_container_list.style.display = "none";
    input_search.value = "";
    input_search_responsive.value = "";
    sessionStorage.removeItem('searchQuery');

    // devuelve el scroll al inicio
    window.scrollTo(0, 0);

    document.title = global_config.site.join('') + " " + global_config.semester.split(' ')[1];

    // borra el estado para que al recargar cargue el inicio
    sessionStorage.removeItem('currentProfile');
}