const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");
require("./models/User");
const transactionRoutes = require("./routes/transactions");



const app = express();


// CORS
app.use(cors());


// JSON
app.use(express.json());


// Teste
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});


// Rotas
app.use("/transactions", transactionRoutes);


// Banco
sequelize.authenticate()
.then(() => {
    console.log("Banco conectado com sucesso!");
})
.catch((error) => {
    console.log("Erro no banco:", error);
});


sequelize.sync()
.then(() => {
    console.log("Banco sincronizado");
})
.catch((err) => {
    console.log("Erro ao sincronizar:", err);
});


// Porta Render
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});