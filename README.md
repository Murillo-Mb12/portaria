# Controle de Portaria — Spring Boot + Angular

```
portaria/
├── backend/    → API REST em Java 17 + Spring Boot 3.5 (porta 8080)
└── frontend/   → Angular 21 (porta 4200)
```

## Como rodar no VS Code

**1. Banco de dados PostgreSQL** (escolha uma opção)

- **Instalado no computador:** instale o PostgreSQL (o instalador já traz o pgAdmin). No pgAdmin,
  clique com o botão direito em *Databases → Create → Database* e crie o banco `portariadb`.
  Por padrão o projeto usa usuário `postgres` e senha `postgres`. Se a sua senha for outra, altere
  `spring.datasource.password` no `application.properties` (ou crie a variável de ambiente `DB_PASSWORD`).
- **Com Docker:** na pasta `portaria`, rode `docker compose up -d`. O banco já sobe criado.

Não é preciso criar tabelas: o **Flyway** roda os scripts de `backend/src/main/resources/db/migration`
(V1 cria as tabelas, V2 insere os dados de exemplo e V3 torna o veículo opcional na entrada).
Se o banco já existia, ao iniciar o backend só os scripts novos são executados.

**2. Backend** (precisa de JDK 17 ou superior)

No VS Code, abra a pasta `portaria`. No **Spring Boot Dashboard**, clique em ▶ ao lado de `portaria`. Ou pelo terminal:

```bash
cd backend
mvnw.cmd spring-boot:run      # Windows
./mvnw spring-boot:run        # Linux/Mac
```

> Sem PostgreSQL? Rode com o perfil `h2` (banco em memória):
> `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2`

**3. Frontend** (precisa de Node 20.19+ ou 22.12+)

```bash
cd frontend
npm install
npm start                     # abre em http://localhost:4200
```

Login: `porteiro / 1234` ou `admin / admin123` (o admin vê "Funcionários").
As senhas ficam gravadas no banco como hash BCrypt.

## Regras de negócio principais

- **Visitante** é parente, cuidador ou amigo e fica **vinculado a um ou mais moradores**.
  Na entrada, só aparecem os moradores vinculados ao visitante escolhido.
- **Veículo** tem placa, marca, modelo e cor. Se for de visitante, pode ter **várias pessoas
  vinculadas** (ex.: membros da mesma família): use o botão **+ Adicionar pessoa** quantas vezes
  quiser; em cada linha dá para filtrar por morador e escolher o visitante.
- **Entrada:** é sempre de uma pessoa, com o objetivo: 1. Visitante (visita a um morador),
  2. Doação (quem trouxe + itens) ou 3. Outros (bazar, igreja, reunião com a equipe,
  imprensa/entrevista, outro). O campo **Veículo (opcional)** fica em "Sem veículo (a pé)"
  quando a pessoa chega a pé. Na visita, só aparecem os veículos vinculados ao visitante.

## Onde está cada aula no backend

Tudo fica em `backend/src/main/java/com/portaria/`:

| Aula | Pasta / arquivo |
|---|---|
| 02 – Entidade | `entities/` → `Morador`, `Visitante`, `Veiculo`, `Funcionario`, `Acesso` (+ `entities/enums/`) |
| 03 – Repositório | `repositories/` → um `JpaRepository` por entidade |
| 04 – application.properties | `src/main/resources/application.properties` (PostgreSQL) e `application-h2.properties` |
| 05 – Seeding | `src/main/resources/db/migration/V2__dados_iniciais.sql` (Flyway) |
| 06 – H2-Console | só no perfil `h2`: http://localhost:8080/h2-console — JDBC URL `jdbc:h2:mem:portariadb`, usuário `sa`, senha vazia. Com PostgreSQL, use o pgAdmin |
| 07 – Service | `services/` → `getMoradores()`, `getVisitantes()`… |
| 08 – Controller | `controllers/` → `getAll()` em cada controller |
| 10 – CRUD | `getAll`, `getById`, `save`, `update`, `delete` em todos os cadastros |
| 11 – DTOs | `dtos/` → `XxxRequest` (entrada) e `XxxResponse` (saída) como `record` |
| 12 – Mappers | `mappers/` → `toEntity()` e `toDTO()` |
| 13 – Validation | anotações nos `XxxRequest` + `@Validated` nos controllers + `exceptions/GlobalExceptionHandler` |

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/login` | Login (RF01) |
| GET/POST | `/api/moradores` | Listar / cadastrar |
| GET/PUT/DELETE | `/api/moradores/{id}` | Buscar / atualizar / excluir |
| … | `/api/visitantes`, `/api/veiculos`, `/api/funcionarios` | Mesmo padrão |
| GET | `/api/acessos?busca=&de=&ate=` | Consulta e relatório (RF10/RF11) |
| GET | `/api/acessos/presentes` | Quem está dentro agora |
| POST | `/api/acessos/entrada` | `{ "objetivo": "VISITA", "visitanteId": 1, "moradorId": 1, "veiculoId": 1 }` (veiculoId opcional) |
| PUT | `/api/acessos/{id}/saida` | Registrar saída |

Erros sempre voltam no formato `{ "status": 400, "erro": "...", "campos": { "telefone": "Telefone inválido" } }`.

## Organização do frontend

```
frontend/src/app/
├── core/                      → o que não tem tela
│   ├── models/                  interfaces que espelham os DTOs do backend
│   ├── services/                chamadas HTTP (uma por recurso da API)
│   ├── guards/                  auth.guard (logado) e admin.guard (RF05)
│   └── utils/                   tratamento de erro e regex de validação
├── shared/components/         → componentes reutilizados
│   ├── erro-campo/              mensagem de validação embaixo do campo
│   └── tabela-acessos/          tabela usada na consulta e no relatório
├── layout/shell/              → menu lateral + <router-outlet>
├── pages/                     → uma pasta por tela (.ts + .html)
│   ├── login/  entrada-saida/  visitantes/  moradores/
│   └── veiculos/  funcionarios/  consulta/  relatorio/
├── app.routes.ts
└── app.config.ts
```

O endereço da API fica em `frontend/src/environments/environment.ts`.

## Observações

- O banco agora é persistente (PostgreSQL): os dados continuam lá depois de reiniciar o backend.
  Para voltar aos dados de exemplo, apague e recrie o banco `portariadb`.
- Mudou alguma tabela? Crie um novo arquivo `V4__descricao.sql` em `db/migration`.
  Nunca altere um script que já foi executado.
- O login ainda não gera token (JWT). O passo seguinte seria Spring Security com JWT.
