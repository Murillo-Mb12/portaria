FROM node:22-alpine AS build
WORKDIR /app

# "npm ci" instala exatamente as versões do package-lock.json (build reproduzível)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npx ng build --configuration production

FROM nginx:1.27-alpine
# openssl: só usado no modo HTTPS opcional, para gerar o certificado do Lar
RUN apk add --no-cache openssl

COPY nginx/limites.conf /etc/nginx/conf.d/00-limites.conf
COPY nginx/portaria-comum.conf nginx/http.conf nginx/https.conf /etc/nginx/portaria/
COPY certificado.sh /etc/nginx/portaria/certificado.sh
# Scripts em /docker-entrypoint.d rodam antes do nginx ligar: este escolhe HTTP ou HTTPS pelo .env.
COPY nginx/modo.sh /docker-entrypoint.d/05-modo-portaria.sh
# (o sed tira o \r caso os arquivos tenham vindo do Windows com quebras de linha CRLF)
RUN sed -i 's/\r$//' /docker-entrypoint.d/05-modo-portaria.sh /etc/nginx/portaria/certificado.sh \
    && chmod +x /docker-entrypoint.d/05-modo-portaria.sh /etc/nginx/portaria/certificado.sh \
    && rm -f /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
