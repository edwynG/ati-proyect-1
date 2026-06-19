import json
import re
from urllib.parse import parse_qs
from beaker.middleware import SessionMiddleware

# borra "const variable =" al inicio de los archivos para que sean json validos
def clean_json(text):
    text = re.sub(r'^(?:const|let|var)\s+\w+\s*=\s*', '', text.strip())
    if text.endswith(';'):
        text = text[:-1]
    return text

def application(environ, start_response):
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    
    # carga la sesion del usuario
    session = environ.get('beaker.session')

    # si piden traducir internamente por AJAX (?fetch_lang=es)
    if 'fetch_lang' in params:
        lang = params['fetch_lang'][0]
        session['lang'] = lang
        session.save()
        
        try:
            with open(f"conf/config{lang.upper()}.json", "r", encoding="utf-8") as f:
                lang_data = clean_json(f.read())
            
            start_response('200 OK', [('Content-Type', 'application/json')])
            return [lang_data.encode('utf-8')]
        except FileNotFoundError:
            start_response('404 Not Found', [('Content-Type', 'application/json')])
            return [b'{"error": "File not found"}']

    # si piden los datos de un estudiante en especifico (?student=28309661)
    elif 'student' in params:
        student_id = params['student'][0]
        
        try:
            with open(f"data/students/{student_id}/profile.json", "r", encoding="utf-8") as f:
                student_data = clean_json(f.read())
                
            start_response('200 OK', [('Content-Type', 'application/json')])
            return [student_data.encode('utf-8')]
        except FileNotFoundError:
            start_response('404 Not Found', [('Content-Type', 'application/json')])
            return [b'{"error": "Not found"}']

    # si piden la lista de todos los estudiantes para el inicio (?profiles=all)
    elif 'profiles' in params:
        try:
            with open("data/index.json", "r", encoding="utf-8") as f:
                profiles_data = clean_json(f.read())
            start_response('200 OK', [('Content-Type', 'application/json')])
            return [profiles_data.encode('utf-8')]
        except FileNotFoundError:
            start_response('404 Not Found', [('Content-Type', 'application/json')])
            return [b'{"error": "Not found"}']

    # si abren localhost:8080/ATI/index.py sin parametros carga el html
    else:
        try:
            with open("views/index.html", "r", encoding="utf-8") as f:
                html_content = f.read()

            start_response('200 OK', [('Content-Type', 'text/html')])
            return [html_content.encode('utf-8')]
        except FileNotFoundError:
            start_response('404 Not Found', [('Content-Type', 'text/plain')])
            return [b'Error']

# donde guarda beaker las sesiones en docker
session_opts = {
    'session.type': 'file',
    'session.cookie_expires': True,
    'session.data_dir': '/tmp/sessions/data',
    'session.lock_dir': '/tmp/sessions/lock',
    'session.auto': True
}

# activa las sesiones en la app
application = SessionMiddleware(application, session_opts)
