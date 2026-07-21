const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

require("dotenv").config();

const sequelize = require("./config/database");

// ===============================
// CARREGAR MODELOS
// ===============================

require("./models/User");
require("./models/Transaction");

// ===============================
// ROTAS
// ===============================

const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/users");

// ===============================
// APP
// ===============================

const app = express();

// Remove informações desnecessárias sobre o servidor
app.disable("x-powered-by");

// Headers de segurança
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

// ===============================
// MIDDLEWARES
// ===============================

// Defina ALLOWED_ORIGINS no .env (separadas por vírgula)
// Exemplo:
// ALLOWED_ORIGINS=https://meusite.com,https://app.meusite.com
//
// Em desenvolvimento, caso a variável não exista,
// qualquer origem será aceita.
const origensPermitidas = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(origem => origem.trim())
    : null;

app.use(
    cors({
        origin: origensPermitidas || true,
        credentials: true,
    })
);

// Limita o tamanho máximo do corpo das requisições JSON
app.use(
    express.json({
        limit: "20kb",
    })
);

// ===============================
// FRONTEND
// ===============================

app.use(
    express.static(
        path.join(__dirname, "../../frontend")
    )
);

// ===============================
// PÁGINA INICIAL
// ===============================

app.get("/", (req, res) => {
    res.sendFile(
        path.resolve(
            __dirname,
            "../../frontend/index.html"
        )
    );
});

// ===============================
// ROTAS DA API
// ===============================

app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);

// ===============================
// BANCO DE DADOS + SERVIDOR
// ===============================

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        console.log("✅ Banco conectado com sucesso!");

        await sequelize.sync();
        console.log("✅ Banco sincronizado!");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
    }
}

iniciarServidor();