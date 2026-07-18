const express = require("express");
const cors = require("cors");
const cors = require("cors");

app.use(cors({
    origin: "https://finance-dashboard-alpha-ebon-63.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

const sequelize = require("./config/database");
const transactionRoutes = require("./routes/transactions");

console.log("TIPO DA ROTA:", typeof transactionRoutes);
console.log("CONTEUDO DA ROTA:", transactionRoutes);

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});


app.use("/transactions", (req, res, next) => {
    console.log("Entrou na rota transactions");
    next();
}, transactionRoutes);


sequelize.authenticate()
.then(() => {
    console.log("Banco conectado com sucesso!");
})
.catch(error => {
    console.log("Erro no banco:", error);
});
sequelize.sync()
.then(() => {
    console.log("Banco sincronizado");
})
.catch(err => {
    console.log("Erro ao sincronizar:", err);
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});