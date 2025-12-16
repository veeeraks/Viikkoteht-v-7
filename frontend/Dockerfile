FROM nginx:1.27-alpine

# Kopioi nginx-konfiguraatio
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopioi frontendin staattiset tiedostot
COPY index.html /usr/share/nginx/html/index.html
