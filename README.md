# Aplicaciones con Tecnología Internet - Proyecto Individual

¡Hola! En este repositorio voy a ir subiendo el progreso de mi proyecto individual para la materia de **Aplicaciones con Tecnología Internet**. 

La idea es simple, cada semana voy a enfrentar un nuevo desafío para dominar las herramientas fundamentales de la web: **HTML, CSS y JavaScript**. El proyecto se compone de **7 retos** en total, y aunque todavía no sé exactamente qué me tocará construir en cada uno, los iré publicando aquí conforme los vaya resolviendo.

### ¿Qué voy a estar usando?
Básicamente los tres pilares del frontend:
* **HTML** para armar la estructura.
* **CSS** para que todo se vea bien.
* **JavaScript** para darle vida y que las cosas funcionen.
* **Python** para manejar los datos y el servidor.
* **Docker** para manejar el entorno.
---

### Estructura del Proyecto

El proyecto está organizado con la siguiente estructura de carpetas:

```text
proyecto_1/
├── index.py                    # Backend (Python WSGI): Sirve la página y actúa como API
├── conf/                       # Archivos de configuración de idioma 
│   └── config*.json
├── data/                       # Datos base del sistema
│   ├── index.json              # Lista general de estudiantes
│   └── students/               # Carpetas por estudiante (perfil en JSON y fotos)
├── docs/                       # Documentación y reportes del proyecto
│   ├── diagrams/               # Árboles DOM, CSSOM y de Renderizado
│   ├── responsive_screenshots/ # Capturas de diseño responsivo
│   └── submissions/            # Archivos PDF de entregas y reportes
├── views/                      # Archivos de la interfaz (HTML)
│   └── index.html              # La única página de la aplicación (SPA)
└── static/                     # Recursos estáticos
    ├── css/
    │   └── style.css           # Estilos visuales
    ├── icon/                   # Iconos de la interfaz
    │   └── *.svg, *.png
    └── js/
        ├── index.js            # Lógica principal, buscador y persistencia de memoria
        └── profile.js          # Lógica para manejar la vista de los perfiles
```

### ¿Por qué cambié la estructura al pasar de MPA a SPA?

Al tomar la decisión de convertir mi proyecto de una **MPA (Multi-Page Application)** a una **SPA (Single Page Application)**, me di cuenta de que la estructura vieja ya no me servía. En una MPA tradicional, cada pantalla es un archivo HTML distinto y el servidor recarga toda la página en cada clic. En cambio, en una SPA solo existe un único archivo HTML que sirve como base, y es Javascript quien se encarga de intercambiar el contenido dinámicamente.

Este cambio radical en cómo funciona la web me obligó a reorganizar mis carpetas. Primero, dejé un único archivo base en la carpeta `views/index.html` y concentré toda la inteligencia de navegación en la carpeta `static/js` (separando la lógica en `index.js` y `profile.js`). 

Además, como en una SPA los datos no pueden estar pegados dentro del HTML, creé la carpeta `data` para aislar la información de los estudiantes en formato JSON. Por ultimo, agregué el archivo `index.py` en la raíz para que actúe como una API: su nuevo trabajo es leer esos archivos JSON y enviárselos "en secreto" a Javascript justo cuando los necesita, permitiendo que la interfaz cambie al instante sin tener que recargar la página nunca más.


### Progreso del Proyecto
Actualmente he completado **7 de 7 retos**. 

---
