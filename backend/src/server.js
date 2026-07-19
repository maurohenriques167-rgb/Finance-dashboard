const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/database");

require("./models/User");
require("./models/Transaction");


const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/users");


const app = express();


// CORS
app.use(cors());


// JSON
app.use(express.json());

const path = require("path");


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


// Rotas API

app.use("/transactions", transactionRoutes);

app.use("/users", userRoutes);




// Banco

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

.catch((err)=>{

    console.log("Erro ao sincronizar:",err);

});





// Porta Render

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});