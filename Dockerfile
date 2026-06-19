FROM ubuntu:latest

# Instalar Apache, Python y modulo WSGI
RUN apt-get update && apt-get install -y \
    apache2 \
    python3 \
    python3-pip \
    python3-venv \
    libapache2-mod-wsgi-py3 \
    && apt-get clean

# Crear entorno virtual AFUERA de la carpeta de codigo
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Instalar modulo Beaker para sesiones
RUN pip install Beaker

# Habilitar WSGI en Apache
RUN a2enmod wsgi

WORKDIR /var/www/html/ATI

COPY . /var/www/html/ATI/

# Indicarle a Apache (mod_wsgi) que use el entorno virtual
RUN echo "WSGIPythonHome /opt/venv" >> /etc/apache2/apache2.conf

# Enrutar peticiones a Python y servir archivos estaticos
RUN echo "WSGIScriptAlias /ATI/index.py /var/www/html/ATI/index.py" >> /etc/apache2/sites-available/000-default.conf
RUN echo "Alias /ATI/static /var/www/html/ATI/static" >> /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]