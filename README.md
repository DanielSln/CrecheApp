# 📌 PokeCreche

## 📖 Descrição

PokeCreche é um sistema híbrido (aplicativo móvel com Ionic/Angular + API em Node/Express) para gestão de creches e comunicação entre docentes e responsáveis. Oferece cadastro e autenticação de alunos e docentes, envio de comunicados com controle de visibilidade, gerenciamento de turmas, registros diários de alimentação/presença/comportamento, calendário de eventos e rascunhos de comunicados.

## 🚀 Funcionalidades principais

- Cadastro e login de alunos (por matrícula + CPF) e docentes (identificador + senha)
- CRUD de turmas e associação de alunos a turmas
- Envio, edição e exclusão de comunicados com controle de visibilidade
- Rascunhos de comunicados por docente
- Registros diários de alunos (alimentação, presença, comportamento, observações)
- Calendário de eventos (criar, listar, remover)
- Upload/atualização de avatar para alunos e docentes (armazenado em LONGTEXT no banco)
- Endpoints de setup para ajustar esquema (ex.: colunas de avatar, tabelas de visibilidade)

## 🛠 Tecnologias Utilizadas

- Front-end: Ionic 8, Angular 20
- Back-end: Node.js, Express
- Banco de dados: MySQL (pacote `mysql2`)
- Nativo/Capacitor: `@capacitor/*` (ex.: câmera)
- Outras libs: `bcryptjs` (hash de senhas), `jsonwebtoken`, `cors`, `ng-circle-progress`, `qrcode-generator`

## 📂 Estrutura relevante do projeto

```
/
├─ src/                 # código front-end (Ionic/Angular)
│  ├─ app/              # páginas e serviços
│  └─ assets/
├─ www/                 # build do frontend (arquivos estáticos servidos pelo backend)
├─ server.js            # API Express
├─ package.json
├─ database_schema.sql  # (esquema do banco)
├─ railway.sql          # (possíveis scripts para deploy)
└─ README-draft.md      # (este arquivo)
```

## ⚙️ Instalação e execução (desenvolvimento)

Pré-requisitos: Node.js (>=18 recomendado), npm, MySQL.

1.  Instalar dependências:

```powershell
npm install
```

2.  Configurar variáveis de ambiente (exemplo `.env` ou variáveis no ambiente):

```text
PORT=3000
MYSQLHOST=localhost
MYSQLUSER=root
MYSQLPASSWORD=q1w2e3
MYSQLDATABASE=PokeCreche
MYSQLPORT=3306
```

3.  Executar o backend (API):

```powershell
node server.js
```

4.  Executar o frontend em modo desenvolvimento (Ionic/Angular):

```powershell
# usar ionic se preferir interface mobile preview
npx ionic serve

# ou utilizar o script do package.json (ng serve)
npm run dev
```

Observação: O `server.js` serve os arquivos estáticos da pasta `www`. Para servir a versão de produção do frontend, gere o build do Angular/Ionic e copie/produza os arquivos em `www` antes de iniciar o `node server.js`:

```powershell
npm run build
# em seguida iniciar o servidor
node server.js
```

## 🔧 Variáveis de ambiente importantes

- `PORT` — porta que o servidor Express irá escutar (padrão 3000)
- `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT` — conexão MySQL
- `API_CONFIG.BASE_URL` no frontend (arquivo `src/app/config/api.config.ts`) deve apontar para a URL pública da API (ex.: `http://localhost:3000` ou URL do Railway/host que você usar)

## 📡 Endpoints principais da API (resumo)

- `POST /register/aluno` — cadastrar aluno (body: `nome`, `cpf`) — gera matrícula automáticamente
- `POST /register/docente` — cadastrar docente (body: `nome`, `senha`) — gera identificador automático
- `POST /login/aluno` — login de aluno (body: `matricula`, `cpf`)
- `POST /login/docente` — login docente (body: `identificador`, `senha`)
- `GET /alunos` — listar alunos
- `PUT /alunos/:id/avatar` — atualizar avatar do aluno (body: `avatar` - base64 LONGTEXT)
- `GET /docentes` — listar docentes
- `PUT /docentes/:id/avatar` — atualizar avatar do docente
- `GET /turmas`, `POST /turmas`, `PUT /turmas/:id`, `DELETE /turmas/:id`
- `GET /turmas/:id/alunos`, `POST /turmas/:id/alunos`, `DELETE /turmas/:turmaId/alunos/:alunoId`
- `GET /comunicados`, `POST /comunicados`, `PUT /comunicados/:id`, `DELETE /comunicados/:id`
- `GET /comunicados/visiveis?user_id=...&user_type=aluno|docente` — busca comunicados com visibilidade
- `GET /rascunhos/:docente_id`, `POST /rascunhos`, `DELETE /rascunhos/:id`
- `GET /registros/:aluno_id`, `POST /registros` — registros diários
- `GET /eventos`, `POST /eventos`, `DELETE /eventos/:date`
- `POST /termos`, `GET /termos/:user_type/:user_id`

Endpoints de configuração/setup (use com cuidado):

- `GET /setup-avatar-columns` — altera colunas `avatar` para `LONGTEXT`
- `GET /setup-visibilidade` — cria/atualiza colunas e tabelas para controle de visibilidade

Exemplo simples de requisição (login de aluno):

```bash
curl -X POST http://localhost:3000/login/aluno \
  -H "Content-Type: application/json" \
  -d '{"matricula":"000001","cpf":"12345678909"}'
```

## 🗄 Banco de dados

- Arquivos relacionados ao esquema estão na raiz: `database_schema.sql`, `railway.sql`, `add_avatar_columns.sql`, `comunicados_visibilidade_update.sql`.
- Rode o script SQL no seu servidor MySQL para criar as tabelas iniciais antes de rodar o app.

## 🧪 Testes

- Atualmente o repositório possui configuração básica para testes com Jasmine/Karma (veja `karma.conf.js` e `package.json` -> `test`). Testes unitários do frontend podem ser executados com:

```powershell
npm test
```

## 🤝 Como contribuir

- Faça um fork e abra um branch para sua alteração: `git checkout -b feat/nome-da-funcionalidade`
- Abra pull request descrevendo as mudanças
- Para mudanças de API, atualize também este README com exemplos e detalhes de migração

## 👥 Autores

- [Daniel Solano](https://github.com/DanielSln)
- [Anthony](https://github.com/Anthony3043)

## 📄 Licença

- Este projeto é licenciado sob a licença MIT — veja o arquivo `LICENSE` para detalhes.

---
