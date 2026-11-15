#!/bin/sh
# =====================================================================
# Certificado HTTPS do Lar (só no modo HTTPS: USAR_HTTPS=sim no .env; chamado pelo nginx/modo.sh)
#
# Cria uma "autoridade certificadora" própria do Lar (só na primeira vez) e,
# com ela, o certificado do servidor para os endereços em ENDERECOS
# (ex.: ENDERECOS=192.168.0.10 no arquivo .env). Tudo fica guardado no volume
# "portaria-certificados", então não muda a cada reinício.
#
# Para os aparelhos confiarem no sistema sem aviso, instale neles o arquivo
# http(s)://ENDERECO:4200/certificado-lar.crt (veja o INSTALACAO-LAR.md).
# =====================================================================
set -e

PASTA=/etc/nginx/certificados
mkdir -p "$PASTA"
cd "$PASTA"

# localhost sempre vale; os outros vêm do .env (separados por vírgula ou espaço)
LISTA="localhost 127.0.0.1 $(echo "${ENDERECOS:-}" | tr ',' ' ')"
SAN=""
for e in $LISTA; do
  if echo "$e" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$'; then
    SAN="$SAN,IP:$e"
  else
    SAN="$SAN,DNS:$e"
  fi
done
SAN="${SAN#,}"

# 1) Autoridade certificadora do Lar (10 anos). Só é criada uma vez.
if [ ! -f ca.key ] || [ ! -f ca.crt ]; then
  echo "[certificado] Criando a autoridade certificadora do Lar..."
  openssl req -x509 -newkey rsa:3072 -nodes -sha256 -days 3650 \
    -keyout ca.key -out ca.crt \
    -subj "/O=Lar Sao Vicente de Paulo/CN=Portaria LSVP - certificado do Lar" \
    -addext "basicConstraints=critical,CA:TRUE" \
    -addext "keyUsage=critical,keyCertSign,cRLSign" 2>/dev/null
  chmod 600 ca.key
  rm -f servidor.crt
fi

# 2) Certificado do servidor: refaz se os endereços mudaram ou se faltam menos de 30 dias
REFAZER=0
[ -f servidor.crt ] && [ -f servidor.key ] || REFAZER=1
[ "$(cat enderecos.txt 2>/dev/null)" = "$SAN" ] || REFAZER=1
if [ "$REFAZER" = 0 ] && ! openssl x509 -checkend 2592000 -noout -in servidor.crt >/dev/null 2>&1; then
  REFAZER=1
fi

if [ "$REFAZER" = 1 ]; then
  echo "[certificado] Gerando o certificado do servidor para: $SAN"
  openssl req -newkey rsa:2048 -nodes -sha256 \
    -keyout servidor.key -out servidor.csr \
    -subj "/O=Lar Sao Vicente de Paulo/CN=Portaria LSVP" 2>/dev/null
  # 825 dias é o máximo que iPhone/iPad aceitam
  printf "subjectAltName=%s\nbasicConstraints=CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\n" "$SAN" > extensoes.cnf
  openssl x509 -req -in servidor.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
    -days 820 -sha256 -extfile extensoes.cnf -out servidor.crt 2>/dev/null
  rm -f servidor.csr extensoes.cnf
  chmod 600 servidor.key
  echo "$SAN" > enderecos.txt
fi

# 3) O arquivo que os aparelhos baixam para confiar no sistema (só o público, nunca a chave)
cp ca.crt /usr/share/nginx/html/certificado-lar.crt
echo "[certificado] Pronto. Endereços válidos: $SAN"
