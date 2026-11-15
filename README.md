# Controle de Portaria — Spring Boot + Angular

```
portaria/
├── backend/    → API REST em Java 17 + Spring Boot 3.5 (porta 8080)
└── frontend/   → Angular 21 (porta 4200)
```

## Como rodar no VS Code

**1. Banco de dados**

Por padrão o backend usa o **H2 em memória**: não precisa instalar nada, é só rodar.
Os dados voltam ao exemplo inicial a cada reinício.

Para usar o **PostgreSQL** (dados permanentes):

1. Instale o PostgreSQL (o instalador traz o pgAdmin) e crie o banco `portariadb`
   (*Databases → Create → Database*). Ou, com Docker, só o banco: `docker compose up -d postgres`.
2. Na raiz do projeto, copie `.env.exemplo` para `.env` e deixe assim:
   ```
   SPRING_PROFILES_ACTIVE=postgre
   DB_PASSWORD=senha_do_seu_postgres
   ```
   O `.env` é lido pelo VS Code ao rodar o backend e **não vai para o GitHub**.

Em qualquer um dos bancos, o **Flyway** cria as tabelas sozinho com os scripts de
`backend/src/main/resources/db/migration`.

**2. Backend** (precisa de JDK 17 ou superior)

No VS Code, abra a pasta `portaria`. No **Spring Boot Dashboard**, clique em ▶ ao lado de `portaria`. Ou pelo terminal:

```bash
cd backend
mvnw.cmd spring-boot:run      # Windows
./mvnw spring-boot:run        # Linux/Mac
```

> Pelo terminal, para usar o PostgreSQL sem o `.env`:
> `mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=postgre"`

**3. Frontend** (precisa de Node 20.19+ ou 22.12+)

```bash
cd frontend
npm install
npm start                     # abre em http://localhost:4200
```

A tela chama a API pelo caminho relativo `/api`; o `npm start` repassa essas chamadas para o
backend na porta 8080 (arquivo `frontend/proxy.conf.json`). Por isso o backend precisa estar rodando.

**Usar no tablet ou celular da portaria** (na mesma rede Wi-Fi): rode `npm run start:rede` e abra
no aparelho `http://IP-DO-COMPUTADOR:4200` (o IP aparece no terminal).

**4. Tudo pelo Docker** (opcional): `docker compose up -d --build` sobe PostgreSQL, backend e
frontend (http://localhost:4200, só no próprio computador) sem precisar de Java, Node.js nem PostgreSQL instalados. É assim que
o sistema roda no computador do Lar: veja o passo a passo em [INSTALACAO-LAR.md](INSTALACAO-LAR.md).

### Preparar a apresentação

Os dados de demonstração (visitas, doação, imprensa) são criados com horários **relativos ao
momento em que o banco é criado** ("há 5 horas", "ontem"...). Para a tela abrir com histórico
recente, recrie o banco de demonstração **no dia**, uns minutos antes de apresentar:

```bash
docker compose down -v
```

```bash
docker compose up -d
```

Espere 1 minuto e abra http://localhost:4200. Usuários: `admin / admin123` (vê Funcionários) e
`porteiro / 1234`. A tela de login da versão instalada não mostra essas senhas.

> `down -v` **apaga todos os dados** do banco. Use só no computador da apresentação, **nunca**
> no computador do Lar depois que ele estiver em uso de verdade.

Roteiro sugerido: login como porteiro → registrar uma visita (a busca acha pelo nome, CPF ou
morador) → uma doação → saída e **Desfazer** → Consulta (mostra "por Carlos Porteiro") →
Relatório e planilha → tema escuro → sair e entrar como admin → Funcionários (senha fraca é
recusada) → errar a senha várias vezes para mostrar o bloqueio (aparece "Muitas tentativas...").

## Testes

```bash
cd backend
mvnw.cmd test                 # regras da API (entrada, saída, consulta, funcionários) no H2

cd frontend
npm test -- --watch=false     # máscaras, busca sem acento e cálculo de permanência
```

Login: `porteiro / 1234` ou `admin / admin123` (o admin vê "Funcionários").
As senhas ficam gravadas no banco como hash BCrypt.

## Regras de negócio principais

- **Morador** tem nome, unidade (ala/quarto) e **CPF** (sem telefone).
- Os campos de **CPF** (000.000.000-00), **telefone/celular** ((00) 0000-0000 ou (00) 00000-0000)
  e **placa** (ABC-1234 ou ABC1D23) são formatados automaticamente enquanto se digita.

- **Visitante** é parente, cuidador ou amigo e fica **vinculado a um ou mais moradores**.
  Na entrada, só aparecem os moradores vinculados ao visitante escolhido.
- **Veículo** tem placa, marca, modelo e cor. Se for de visitante, pode ter **várias pessoas
  vinculadas** (ex.: membros da mesma família): use o botão **+ Adicionar pessoa** quantas vezes
  quiser; em cada linha dá para filtrar por morador e escolher o visitante.
- **Entrada:** é sempre de uma pessoa, com o objetivo: 1. Visitante (visita a um morador),
  2. Doação (quem trouxe + itens) ou 3. Outros (bazar, igreja, reunião com a equipe,
  imprensa/entrevista, outro). O campo **Veículo (opcional)** fica em "Sem veículo (a pé)"
  quando a pessoa chega a pé. Na visita, só aparecem os veículos vinculados ao visitante.
  A mesma pessoa (visitante ou CPF informado) e o mesmo veículo não entram duas vezes sem sair.
- **Saída:** um clique em "Registrar saída". Clicou na linha errada? O aviso traz o botão
  **Desfazer**, que vale por 10 minutos.
- **Quem registrou:** cada entrada e cada saída guardam o nome do funcionário logado que a
  registrou ("por Carlos Porteiro" na consulta, no relatório e na planilha; passe o mouse sobre o
  horário na tela de Entrada e saída). Fica o nome, então o histórico continua certo mesmo se o
  funcionário for excluído depois. A busca da consulta também acha pelo nome do porteiro.
- **Funcionários:** na edição, a senha em branco mantém a senha atual. O único administrador
  não pode ser excluído nem virar porteiro (o sistema nunca fica sem administrador).

## Onde está cada aula no backend

Tudo fica em `backend/src/main/java/com/portaria/`:

| Aula | Pasta / arquivo |
|---|---|
| 02 – Entidade | `entities/` → `Morador`, `Visitante`, `Veiculo`, `Funcionario`, `Acesso` (+ `entities/enums/`) |
| 03 – Repositório | `repositories/` → um `JpaRepository` por entidade |
| 04 – application.properties | `src/main/resources/application.properties` (geral + H2) e `application-postgre.properties` |
| 05 – Seeding | `src/main/resources/db/migration/V2__dados_iniciais.sql` (Flyway) |
| 06 – H2-Console | no modo padrão (H2): http://localhost:8080/h2-console — JDBC URL `jdbc:h2:mem:portariadb`, usuário `sa`, senha vazia. Com PostgreSQL, use o pgAdmin |
| 07 – Service | `services/` → `getMoradores()`, `getVisitantes()`… |
| 08 – Controller | `controllers/` → `getAll()` em cada controller |
| 10 – CRUD | `getAll`, `getById`, `save`, `update`, `delete` em todos os cadastros |
| 11 – DTOs | `dtos/` → `XxxRequest` (entrada) e `XxxResponse` (saída) como `record` |
| 12 – Mappers | `mappers/` → `toEntity()` e `toDTO()` |
| 13 – Validation | anotações nos `XxxRequest` + `@Validated` nos controllers + `exceptions/GlobalExceptionHandler` |

## Endpoints

Todas as rotas, menos o login, exigem o token devolvido no login, no cabeçalho
`Authorization: Bearer <token>` (sem ele a API responde 401). As rotas de `/api/funcionarios`
são só para o administrador (o porteiro recebe 403). A sessão vale 12 horas a partir do login (um plantão);
se o servidor reiniciar, todos entram de novo.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/login` | Login (RF01): devolve `id`, `nome`, `perfil` e `token` |
| POST | `/api/logout` | Sair: o token deixa de valer |
| GET/POST | `/api/moradores` | Listar / cadastrar |
| GET/PUT/DELETE | `/api/moradores/{id}` | Buscar / atualizar / excluir |
| … | `/api/visitantes`, `/api/veiculos`, `/api/funcionarios` | Mesmo padrão |
| GET | `/api/acessos?busca=&de=&ate=` | Consulta e relatório (RF10/RF11) |
| GET | `/api/acessos/presentes` | Quem está dentro agora |
| POST | `/api/acessos/entrada` | `{ "objetivo": "VISITA", "visitanteId": 1, "moradorId": 1, "veiculoId": 1 }` (veiculoId opcional) |
| PUT | `/api/acessos/{id}/saida` | Registrar saída |
| DELETE | `/api/acessos/{id}/saida` | Desfazer a saída (até 10 minutos depois) |

Na consulta, o período (`de`/`ate`) é filtrado no banco e a `busca` ignora acentos e maiúsculas.
As listas de cadastros vêm em ordem alfabética.

Erros sempre voltam no formato `{ "status": 400, "erro": "...", "campos": { "telefone": "Telefone inválido" } }`,
inclusive rota inexistente (404) e falha inesperada (500, com o detalhe só no log do servidor).

## Organização do frontend

```
frontend/src/app/
├── core/                      → o que não tem tela
│   ├── models/                  interfaces que espelham os DTOs do backend
│   ├── services/                chamadas HTTP (uma por recurso da API) + avisos e confirmação
│   ├── guards/                  auth.guard (logado) e admin.guard (RF05)
│   └── utils/                   tratamento de erro, regex de validação, busca sem acento e datas
├── shared/components/         → componentes reutilizados
│   ├── erro-campo/              mensagem de validação embaixo do campo
│   ├── campo-busca/             campo de escolha com busca (visitante na entrada)
│   ├── selecao-multipla/        caixas de seleção com busca (moradores do visitante)
│   ├── avisos/                  aviso no rodapé da tela ("Saída registrada. Desfazer")
│   ├── dialogo-confirmacao/     janela "Excluir o cadastro de ...?"
│   ├── icone/                   ícones em SVG
│   └── tabela-acessos/          tabela usada na consulta e no relatório
├── shared/directives/mascara  → máscaras de CPF, telefone e placa
├── layout/shell/              → menu lateral + <router-outlet>
├── pages/                     → uma pasta por tela (.ts + .html)
│   ├── login/  entrada-saida/  visitantes/  moradores/
│   └── veiculos/  funcionarios/  consulta/  relatorio/
├── app.routes.ts
└── app.config.ts
```

O endereço da API fica em `frontend/src/environments/environment.ts` (`/api`, repassado ao backend
pelo `proxy.conf.json` no desenvolvimento e pela pasta `nginx/` no Docker).

## Segurança

| Proteção | Onde fica | O que faz |
|---|---|---|
| Login com token | `services/SessaoService`, `config/AutenticacaoInterceptor` | Toda chamada à API exige o token do login; sessão de 12 h a partir do login (não renova sozinha) |
| Perfil | `AutenticacaoInterceptor` | `/api/funcionarios` só para administrador (porteiro recebe 403) |
| Força bruta | `services/TentativasLoginService` | 5 senhas erradas para o mesmo usuário (ou 20 do mesmo aparelho) bloqueiam por 15 min (429) |
| Usuários escondidos | `FuncionarioService.login` | Mesma mensagem e mesmo tempo de resposta para usuário inexistente e senha errada |
| Senha forte | `FuncionarioRequest` + tela de Funcionários | Senhas novas: 8+ caracteres, com letras e números (guardadas como hash BCrypt) |
| Registro | logger `SEGURANCA` | Logins, senhas erradas, bloqueios e acessos negados, com o endereço de quem tentou (nunca a senha) |
| Cabeçalhos | `config/CabecalhosSegurancaFilter`, `frontend/nginx/` | CSP (bloqueia scripts injetados), anti-iframe, nosniff, sem cache de dados pessoais |
| Limite de requisições | `frontend/nginx/` | Login: 10 por minuto por aparelho; API: 20 por segundo |
| Rede | `docker-compose.yml` | Banco, backend **e a tela** só aceitam conexões do próprio computador da portaria (127.0.0.1): ninguém no Wi-Fi do Lar chega ao sistema |
| HTTPS (opcional) | `frontend/nginx/`, `frontend/certificado.sh` | Desligado por padrão. Com `ACESSO_WEB=0.0.0.0` e `USAR_HTTPS=sim` no `.env`, libera tablets/celulares só por HTTPS (TLS 1.2/1.3), com certificado próprio do Lar criado na primeira vez (INSTALACAO-LAR.md, fim do guia) |
| Demonstração | `environment.production.ts` | A versão instalada não mostra os usuários de demonstração no login |

Ver os eventos de segurança no Docker:

```bash
docker compose logs backend | findstr SEGURANCA
```

## Observações

- No H2 os dados somem ao reiniciar. No PostgreSQL ficam salvos; para voltar aos dados de
  exemplo, apague e recrie o banco `portariadb`.
- Mudou alguma tabela? Crie um novo arquivo `V7__descricao.sql` em `db/migration`.
  Nunca altere um script que já foi executado.
- O login gera um token aleatório guardado na memória do servidor (`services/SessaoService`),
  conferido em toda chamada por `config/AutenticacaoInterceptor`. Sair, excluir o funcionário ou
  trocar a senha/perfil dele encerra as sessões abertas.
