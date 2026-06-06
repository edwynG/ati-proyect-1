# Use la imagen oficial de Apache HTTP Server como base
FROM httpd:latest

WORKDIR /usr/local/apache2/htdocs/ 

# En la imagen oficial, la ruta por defecto es /usr/local/apache2/htdocs/
COPY . /usr/local/apache2/htdocs/

EXPOSE 80