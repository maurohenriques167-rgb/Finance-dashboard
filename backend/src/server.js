const express = require("express");
const cors = require("cors");
const path = require("path");

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

app.use(cors());

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
// BANCO DE DADOS
// ===============================

sequelize.authenticate()

.then(()=>{

    console.log("Banco conectado com sucesso!");

})

.catch((error)=>{

    console.log("Erro no banco:", error);

});



sequelize.sync()

.then(()=>{

    console.log("Banco sincronizado!");

})

.catch((error)=>{

    console.log("Erro ao sincronizar:", error);

});



// ===============================
// SERVIDOR
// ===============================

const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});