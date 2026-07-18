const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");
const transactionRoutes = require("./routes/transactions");

const app = express();


// CORS - permite o Vercel acessar o backend
app.use(cors({
    origin: "https://finance-dashboard-alpha-ebon-63.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


// Receber JSON
app.use(express.json());


// Teste do servidor
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});


// Rotas das transações
app.use("/transactions", (req, res, next) => {

    console.log("Entrou na rota transactions");

    next();

}, transactionRoutes);


// Conectar banco
sequelize.authenticate()

.then(() => {

    console.log("Banco conectado com sucesso!");

})

.catch(error => {

    console.log("Erro no banco:", error);

});


// Criar/atualizar tabelas
sequelize.sync()

.then(() => {

    console.log("Banco sincronizado");

})

.catch(err => {

    console.log("Erro ao sincronizar:", err);

});


// Render usa a porta da variável PORT
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(`Servidor rodando na porta: ${PORT}`);

});