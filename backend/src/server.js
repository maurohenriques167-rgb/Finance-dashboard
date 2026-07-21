const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const sequelize = require("./config/database");

// Carregar modelos
require("./models/User");
require("./models/Transaction");


// Rotas
const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/users");



const app = express();


// ===============================
// MIDDLEWARES
// ===============================

// Defina ALLOWED_ORIGINS no .env (separadas por vírgula) para restringir
// quem pode chamar a API em produção, ex:
// ALLOWED_ORIGINS=https://seu-frontend.com,https://outro-dominio.com
// Sem essa variável, libera geral (útil em desenvolvimento local).
const origensPermitidas = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : null;

app.use(cors({
    origin: origensPermitidas || true,
    credentials: true
}));

app.use(express.json());


// ===============================
// SERVIR FRONTEND
// ===============================

app.use(express.static(
    path.join(__dirname, "../../frontend")
));


// ===============================
// PÁGINA INICIAL
// ===============================

app.get("/", (req,res)=>{

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

            console.log(
                `🚀 Servidor rodando na porta ${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "❌ Erro ao iniciar servidor:",
            error
        );

    }

}

iniciarServidor();