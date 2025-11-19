# 📌 PokeCreche

## 📖 Descrição

PokeCreche é um sistema híbrido (aplicativo móvel com Ionic/Angular + API em Node/Express) para gestão de creches e comunicação entre docentes e responsáveis. Oferece cadastro e autenticação de alunos e docentes, envio de comunicados com controle de visibilidade, gerenciamento de turmas, registros diários de alimentação/presença/comportamento, calendário de eventos e rascunhos de comunicados.

## 🚀 Funcionalidades

- [x] Cadastro de alunos (gera matrícula automática)
- [x] Cadastro de docentes (gera identificador automático)
- [x] Login de alunos (matrícula + CPF)
- [x] Login de docentes (identificador + senha)
- [x] CRUD de turmas e associação de alunos a turmas
- [x] Envio, edição e exclusão de comunicados
- [x] Controle de visibilidade de comunicados (público/privado/destinatário)
- [x] Rascunhos de comunicados por docente
- [x] Registro diário de alunos (alimentação, presença, comportamento, observações)
- [x] Calendário de eventos (criar, listar, remover)
- [x] Upload/atualização de avatar para alunos e docentes (armazenado como LONGTEXT)
- [x] Endpoints de setup para ajustes de esquema (ex.: colunas avatar, tabelas de visibilidade)

## 🛠 Tecnologias Utilizadas

- Front-end: Ionic 8, Angular 20
- Back-end: Node.js, Express
- Banco de dados: MySQL (pacote `mysql2`)
- Nativo/Capacitor: `@capacitor/*` (ex.: câmera)
- Outras libs: `bcryptjs` (hash de senhas), `jsonwebtoken`, `cors`, `ng-circle-progress`, `qrcode-generator`

## 📂 Estrutura do Projeto

```
/
├─ src/                     # código front-end (Ionic/Angular)
│  ├─ app/                  # páginas, rotas e services
│  └─ assets/
├─ www/                     # build estático do frontend (servido pelo backend)
├─ server.js                # API Express (principal)
├─ package.json
├─ database_schema.sql      # esquema do banco de dados
├─ railway.sql              # scripts para deploy (Railway)
├─ add_avatar_columns.sql   # scripts auxiliares de migração
├─ comunicados_visibilidade_update.sql
└─ README 1.md              # (este arquivo) - documentação conforme template
```

## 📊 Análise de Mercado

Público-alvo: creches, coordenadores pedagógicos, professores e responsáveis (pais) que necessitam de comunicação direta e registro diário do cotidiano da criança.

Concorrência: existem sistemas amplos de gestão escolar e plataformas de comunicação escolar (ex.: ClassDojo, agenda escolar) — PokeCreche diferencia-se por ser focado em creche/educação infantil, oferecer integração simples via aplicativo híbrido, controle fino de visibilidade de comunicados e registros diários padronizados.

Proposta de valor: facilitar a rotina pedagógica e administrativa, melhorar a comunicação com os responsáveis e centralizar registros de atendimento/rotina da criança em um único lugar, com interface móvel amigável.

## 📐 Diagramas

-- Caso de Uso: `docs/diagramas/caso_uso.png` (placeholder - adicionar imagem real)
-- Diagrama de Classes: `docs/diagramas/classes.png` (placeholder - adicionar imagem real)

## ✅ Requisitos

**Funcionais (exemplos mapeados a partir do código):**

- RF01 - RF01.1: Cadastro de aluno com validação de CPF e geração automática de matrícula (`POST /register/aluno`)
- RF02 - RF02.1: Cadastro de docente com hash de senha e geração de identificador (`POST /register/docente`)
- RF03: Autenticação de aluno (matrícula + CPF) e retorno de token básico (`POST /login/aluno`)
- RF04: Autenticação de docente (identificador + senha) com verificação por `bcryptjs` (`POST /login/docente`)
- RF05: Gerenciamento de turmas (criar, listar, editar, excluir) e associação de alunos (`GET/POST/PUT/DELETE /turmas`)
- RF06: Enviar, editar e excluir comunicados com possibilidade de destinatários e visibilidade (`/comunicados` e `/comunicados/visiveis`)
- RF07: Salvar e listar rascunhos por docente (`GET /rascunhos/:docente_id`, `POST /rascunhos`)
- RF08: Registrar ocorrências diárias de alunos (`GET /registros/:aluno_id`, `POST /registros`)
- RF09: Gerenciar eventos do calendário (`GET /eventos`, `POST /eventos`, `DELETE /eventos/:date`)
- RF10: Atualizar avatar de alunos/docentes via endpoint (`PUT /alunos/:id/avatar`, `PUT /docentes/:id/avatar`)

**Não Funcionais:**

- RNF01: Segurança — senhas armazenadas com bcrypt e comunicação por HTTPS em produção (configurar SSL no host)
- RNF02: Performance — API projetada para cargas moderadas; use índices no MySQL para consultas frequentes (ex.: `comunicados`, `comunicado_visibilidade`)
- RNF03: Disponibilidade — recomenda-se deploy em infraestrutura com restart automático (Railway, Heroku, Docker)
- RNF04: Portabilidade — frontend híbrido (Ionic/Capacitor) para rodar em Android/iOS e web
- RNF05: Backup e integridade — políticas de backup do banco de dados e migrations para evolução do schema

## 🧪 Testes

- Frontend: configuração com Jasmine/Karma conforme `package.json` — escreva testes unitários para componentes e services (`npm test`).
- Backend: testes de integração recomendados (Postman/Newman) cobrindo: autenticação, criação de comunicados, visibilidade, CRUD de turmas e manipulação de rascunhos.
- Estratégia: criar uma coleção Postman com ambientes (`dev`, `prod`) e incluir exemplos de payloads; para CI, usar `newman` para validar endpoints em pipelines.

## 👥 Autores

- [Daniel Solano](https://github.com/DanielSln)
- [Anthony](https://github.com/Anthony3043)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para detalhes.
