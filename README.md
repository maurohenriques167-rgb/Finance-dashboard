# Finance Dashboard

Aplicação de controle financeiro pessoal: cadastro/login de usuário e
gerenciamento de transações (receitas/despesas).

## Estrutura do projeto

```
.
├── backend/
│   └── src/
│       ├── config/database.js      # conexão Sequelize/MySQL
│       ├── middleware/
│       │   ├── auth.js             # valida o JWT nas rotas protegidas
│       │   └── rateLimit.js        # limita tentativas de login/cadastro
│       ├── models/                 # User, Transaction
│       ├── routes/                 # /users, /transactions
│       └── server.js               # ponto de entrada da API
│
└── frontend/
    ├── config.js        # URL da API, carregado antes de tudo em toda página
    ├── index.html        # cadastro
    ├── login.html
    ├── dashboard.html
    ├── sobre.html
    ├── login.css / style.css
    ├── login.js / cadastro.js
    └── js/                # scripts do dashboard, carregados em ordem:
        ├── 00-estado-auth.js
        ├── 01-dados-dashboard.js
        ├── 02-lista-filtros.js
        ├── 03-grafico.js
        ├── 04-formularios-transacoes.js
        ├── 05-ui-extra.js
        └── 06-init.js
```

O `backend/src/server.js` também serve os arquivos de `frontend/` como
estáticos, então em desenvolvimento local um único servidor atende API e
frontend juntos.

## Configuração

Crie um arquivo `.env` dentro de `backend/` (nunca commitado — veja
`.gitignore`) com:

```
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_POOL_MAX=5

JWT_SECRET=       # string longa e aleatória, só usada pelo backend
PORT=3000

# Opcional: restringe quem pode chamar a API em produção
# (separado por vírgula). Sem isso, libera geral.
ALLOWED_ORIGINS=https://seu-frontend.com
```

## Rodando localmente

```bash
cd backend
npm install
npm start
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`).
