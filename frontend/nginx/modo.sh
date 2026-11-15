#!/bin/sh
# =====================================================================
# Escolhe o modo do servidor web toda vez que o contêiner liga:
#   - padrão: HTTP, só para o próprio computador da portaria;
#   - USAR_HTTPS=sim no .env: HTTPS com o certificado do Lar (para tablets/celulares no Wi-Fi).
# =====================================================================
set -e

case "$(echo "${USAR_HTTPS:-nao}" | tr 'A-Z' 'a-z')" in
  sim|s|true|1|yes)
    echo "[portaria] Modo HTTPS ligado."
    /etc/nginx/portaria/certificado.sh
    cp /etc/nginx/portaria/https.conf /etc/nginx/conf.d/default.conf
    ;;
  *)
    echo "[portaria] Modo HTTP (só este computador). Para tablets/celulares, use USAR_HTTPS=sim no .env."
    rm -f /usr/share/nginx/html/certificado-lar.crt
    cp /etc/nginx/portaria/http.conf /etc/nginx/conf.d/default.conf
    ;;
esac
