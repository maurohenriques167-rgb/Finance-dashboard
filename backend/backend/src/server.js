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
// MIDDLEWARES
// ===============================

const globalRateLimit = require("./middleware/globalRateLimit");

// ===============================
// ROTAS
// ===============================

const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/users");

// ===============================
// APP
// ===============================

const app = express();

// Remove informações desnecessárias
app.disable("x-powered-by");

// ===============================
// HELMET
// ===============================

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
// RATE LIMIT GLOBAL
// ===============================

app.use(globalRateLimit);

// ===============================
// CORS
// ===============================

const origensPermitidas = (
    process.env.ALLOWED_ORIGINS || ""
)
    .split(",")
    .map(origem => origem.trim())
    .filter(Boolean);

app.use(
    cors({

        origin(origin, callback) {

            // Permite Postman, Insomnia e chamadas sem Origin
            if (!origin) {
                return callback(null, true);
            }

            if (origensPermitidas.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Origem não permitida pelo CORS.")
            );

        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]

    })
);

// Responde requisições OPTIONS
app.options("*", cors());

// ===============================
// PARSER
// ===============================

app.use(
    express.json({
        limit: "20kb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "20kb"
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
// HOME
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
// API
// ===============================

app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);

// ===============================
// BANCO + SERVIDOR
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