# Instalar a Portaria no computador do Lar (com Docker)

O Docker roda o sistema inteiro (banco PostgreSQL, backend e telas) dentro de "contêineres".
O computador **não precisa** de Java, Node.js nem PostgreSQL instalados. Precisa de internet
**só na instalação** (e quando for atualizar); no dia a dia o sistema funciona sem internet.

## O que o computador precisa ter

- Windows 10 ou 11 de 64 bits, com a virtualização ligada (vem ligada na maioria dos computadores;
  se o Docker reclamar, ela é ativada na BIOS/UEFI do computador).
- Pelo menos 8 GB de memória RAM (funciona com 4 GB, mas fica lento).
- Uns 10 GB livres no disco.

## 1. Instalar o Docker Desktop (uma vez só)

1. Baixe o **Docker Desktop para Windows** em https://www.docker.com/products/docker-desktop/ e instale
   com as opções padrão. Se ele pedir para instalar ou atualizar o **WSL 2**, aceite.
2. Reinicie o computador quando pedir.
3. Abra o Docker Desktop. Na primeira vez ele pede para aceitar os termos; pode pular o login
   (não precisa de conta).
4. Em **Settings (engrenagem) → General**, deixe marcado
   **"Start Docker Desktop when you sign in to your computer"**. Assim o sistema volta sozinho
   sempre que o computador for ligado.

> O Docker Desktop é gratuito para organizações pequenas (menos de 250 funcionários e
> menos de US$ 10 milhões de faturamento por ano), o que cobre o Lar.

## 2. Copiar o projeto para o computador

- Pelo GitHub: no repositório, botão **Code → Download ZIP**, e extraia em uma pasta fixa, por exemplo
  `C:\Portaria`. A pasta certa é a que tem o arquivo `docker-compose.yml` dentro.
- Ou copie a pasta `portaria` de um pendrive para `C:\Portaria`.

## 3. Definir a senha do banco (antes da primeira vez)

1. Abra o **Bloco de Notas** e escreva uma linha só, trocando pela senha que vocês escolherem:
   ```
   DB_PASSWORD=uma-senha-forte-aqui
   ```
2. **Arquivo → Salvar como**, na pasta onde está o `docker-compose.yml`:
   - Nome: `.env` (com o ponto no começo)
   - Tipo: **Todos os arquivos (*.*)** (senão o Windows salva como `.env.txt`)
3. Guarde essa senha num lugar seguro. Ela vale a partir da primeira instalação; depois disso,
   trocar o arquivo não troca a senha do banco.

## 4. Ligar o sistema pela primeira vez

1. Abra a pasta do projeto no Explorador de Arquivos, clique com o botão direito num espaço vazio e
   escolha **Abrir no Terminal** (no Windows 10: Shift + botão direito → **Abrir janela do PowerShell aqui**).
2. Digite e aperte Enter:
   ```
   docker compose up -d --build
   ```
3. Na primeira vez demora de 5 a 15 minutos (ele baixa e monta tudo). Termina quando aparecerem as
   linhas `Container portaria-frontend Started`.
4. Abra o navegador em **http://localhost:4200**.
5. Para facilitar, crie um atalho na área de trabalho para esse endereço.

> O sistema só abre **neste computador**: por segurança, outros aparelhos do Wi-Fi do Lar não
> conseguem nem chegar à tela de login. Se um dia precisarem usar tablet ou celular, veja
> **"Se um dia for usar tablet ou celular"** no fim deste guia.

## 5. Primeiro acesso: trocar as senhas de demonstração

O sistema vem com dois usuários de exemplo: `admin / admin123` e `porteiro / 1234`.

1. Entre como `admin`, vá em **Funcionários** e cadastre os funcionários de verdade
   (pelo menos um **Administrador** e os **Porteiros**).
2. Edite o usuário `admin` e coloque uma **nova senha**; exclua o usuário `porteiro` de exemplo.
   As senhas novas precisam ter **pelo menos 8 caracteres, com letras e números**.
   A tela de login da versão instalada não mostra as senhas de demonstração: anote-as antes.

### Segurança no dia a dia

O computador da portaria é **um só, usado por vários porteiros**. Por isso:

- Cada porteiro tem o **próprio usuário e senha** (cadastrados em **Funcionários**); não
  compartilhem senhas nem entrem com o usuário de outro.
- O sistema anota **qual porteiro registrou cada entrada e cada saída** (aparece na Consulta e no
  Relatório). Por isso é importante cada um usar o próprio login.
- **Na troca de turno, clique em Sair** antes de passar o computador; o próximo porteiro entra
  com o usuário dele. Mesmo que alguém esqueça, a sessão acaba sozinha 12 horas depois do login.
- Não deixem o navegador **salvar a senha** ("Salvar senha?" → **Nunca**): senão qualquer um
  entra com o usuário de quem salvou.
- **5 senhas erradas** seguidas bloqueiam aquele usuário por **15 minutos**. Se alguém esquecer a
  senha, o administrador coloca uma nova em **Funcionários**.
- Para ver quem tentou entrar (e de qual aparelho), no Prompt de Comando da pasta do sistema:
  `docker compose logs backend | findstr SEGURANCA`

> **Atenção:** o banco também vem com moradores, visitantes, veículos e acessos **fictícios** de
> demonstração. Alguns não podem ser excluídos pela tela, porque já têm acessos registrados.
> Antes de usar no Lar de verdade, peça para a equipe do projeto limpar esses dados de exemplo.

## Uso no dia a dia

- **Não precisa fazer nada:** é só ligar o computador e entrar no Windows. O Docker Desktop abre
  sozinho e o sistema volta em 1 ou 2 minutos, com todos os dados.
- O computador precisa ficar **ligado e com o usuário do Windows logado** enquanto a portaria
  estiver usando o sistema (inclusive à noite).

## Backup (cópia de segurança)

Faça pelo menos uma vez por semana e guarde a cópia fora do computador (pendrive, nuvem).
No terminal, dentro da pasta do projeto:

```
docker exec portaria-postgres pg_dump -U postgres -f /tmp/backup.sql portariadb
docker cp portaria-postgres:/tmp/backup.sql .\backup-portaria.sql
```

O arquivo `backup-portaria.sql` aparece na pasta do projeto. Renomeie com a data
(ex.: `backup-portaria-2026-11-15.sql`) e copie para o pendrive.

### Restaurar um backup

Isto **substitui** todos os dados atuais pelos do backup. Com o arquivo do backup na pasta do projeto,
com o nome `backup-portaria.sql`:

```
docker compose stop backend
docker cp .\backup-portaria.sql portaria-postgres:/tmp/backup.sql
docker exec portaria-postgres psql -U postgres -c "DROP DATABASE portariadb WITH (FORCE);" -c "CREATE DATABASE portariadb;"
docker exec portaria-postgres psql -U postgres -d portariadb -q -f /tmp/backup.sql
docker compose start backend
```

## Atualizar para uma versão nova do sistema

1. Faça um **backup** (acima).
2. Substitua os arquivos da pasta pelos da versão nova, **mantendo o arquivo `.env`**.
3. No terminal, na pasta do projeto:
   ```
   docker compose up -d --build
   ```
   Os dados continuam: eles ficam guardados à parte, no volume `portaria-dados`.

## Comandos úteis

| Para... | Comando |
|---|---|
| Ver se está tudo rodando | `docker compose ps` |
| Desligar o sistema | `docker compose down` |
| Ligar de novo | `docker compose up -d` |
| Ver os erros do backend | `docker logs portaria-backend --tail 50` |

> **Nunca use `docker compose down -v`**: o `-v` apaga o banco de dados com todos os registros.

## Problemas comuns

- **"docker não é reconhecido"** ou **"failed to connect to the docker API"**: o Docker Desktop está
  fechado. Abra o Docker Desktop, espere o ícone da baleia ficar verde ("Engine running") e tente de novo.
- **A porta 4200 já está em uso**: crie no `.env` uma segunda linha `PORTA_WEB=8081` e rode
  `docker compose up -d` de novo; o endereço passa a ser `http://localhost:8081`.
- **A tela abre, mas aparece "Sem conexão com o servidor"**: o backend ainda está ligando (espere
  1 minuto) ou parou; veja `docker logs portaria-backend --tail 50`.
- **Horários errados**: confira se a data e a hora do Windows estão certas (o sistema já usa o
  horário de Brasília por conta própria).

## Se um dia for usar tablet ou celular

Hoje o sistema fica fechado no computador da portaria. Para liberar outros aparelhos do Wi-Fi,
liguem também a **conexão segura (HTTPS)**: assim senhas e dados das pessoas não passam abertos
pela rede.

1. No computador, descubra o IP: no terminal, digite `ipconfig` e veja o **Endereço IPv4**
   (algo como `192.168.1.17`). Peçam para quem cuida da internet do Lar deixar esse IP **fixo**
   (reserva de DHCP no roteador).
2. Acrescente estas linhas no arquivo `.env` (com o IP anotado):
   ```
   ACESSO_WEB=0.0.0.0
   USAR_HTTPS=sim
   ENDERECOS=192.168.1.17
   ```
3. No terminal da pasta do sistema: `docker compose up -d`.
4. O endereço passa a ser **https://IP-DO-COMPUTADOR:4200** (com **s**). No próprio computador,
   **https://localhost:4200**.
5. Na primeira vez que liga nesse modo, o sistema cria um **certificado próprio do Lar**. Cada
   aparelho precisa instalá-lo **uma vez** (veja abaixo); até lá, o navegador mostra um aviso de
   "conexão não particular".
6. Se o tablet não abrir, o Firewall do Windows pode estar bloqueando: se aparecer o aviso do
   Firewall para o Docker, clique em **Permitir acesso** para redes **privadas**.

### Instalar o certificado do Lar nos aparelhos

O arquivo fica em **https://ENDERECO:4200/certificado-lar.crt**. Para baixá-lo antes de instalar,
o navegador vai mostrar o aviso: clique em **Avançado → Continuar** só para essa página.

**No computador da portaria (Windows):**
1. Abra `https://localhost:4200/certificado-lar.crt` e salve o arquivo.
2. Dê dois cliques no arquivo → **Instalar Certificado** → **Máquina Local** → Avançar.
3. Escolha **Colocar todos os certificados no repositório a seguir** → **Procurar** →
   **Autoridades de Certificação Raiz Confiáveis** → OK → Avançar → Concluir.
4. Feche e abra o navegador de novo.

**No tablet/celular Android:**
1. Abra `https://IP-DO-COMPUTADOR:4200/certificado-lar.crt` e baixe o arquivo.
2. **Configurações → Segurança → Mais configurações de segurança → Instalar do armazenamento**
   (o nome muda um pouco conforme o aparelho) → **Certificado CA** → escolha `certificado-lar.crt`.

**No iPhone/iPad:**
1. Abra `https://IP-DO-COMPUTADOR:4200/certificado-lar.crt` no **Safari** e permita o download.
2. **Ajustes → Perfil Baixado → Instalar**.
3. **Ajustes → Geral → Sobre → Ajustes de Confiança de Certificados** → ative o "Portaria LSVP".

> **Mudou o IP do computador?** Troque o `ENDERECOS` no `.env` e rode `docker compose up -d`.
> O certificado do servidor é refeito sozinho; os aparelhos **não** precisam instalar nada de novo.
>
> **Nunca** compartilhe a pasta de certificados do Docker: só o arquivo `certificado-lar.crt`
> (que é público) deve ir para os aparelhos.
>
> **Voltar ao modo só do computador:** apague as três linhas do `.env` e rode `docker compose up -d`.
