const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Transaction = require("../models/Transaction");


// Campos que o cliente pode enviar. Qualquer outro campo (ex: userId, id)
// é ignorado, evitando "mass assignment".
const CAMPOS_PERMITIDOS = ["description", "amount", "type", "date", "category"];

function extrairCamposPermitidos(body) {
    const dados = {};
    for (const campo of CAMPOS_PERMITIDOS) {
        if (body[campo] !== undefined) {
            dados[campo] = body[campo];
        }
    }
    return dados;
}

function validarTransacao(dados, { exigirTodos }) {
    const erros = [];

    if (exigirTodos || dados.description !== undefined) {
        if (!dados.description || typeof dados.description !== "string" || !dados.description.trim()) {
            erros.push("description é obrigatória e não pode ser vazia");
        }
    }

    if (exigirTodos || dados.amount !== undefined) {
        const valor = Number(dados.amount);
        if (dados.amount === undefined || dados.amount === null || isNaN(valor) || valor <= 0) {
            erros.push("amount deve ser um número maior que zero");
        }
    }

    if (exigirTodos || dados.type !== undefined) {
        if (!["receita", "despesa"].includes(dados.type)) {
            erros.push("type deve ser 'receita' ou 'despesa'");
        }
    }

    if (exigirTodos || dados.date !== undefined) {
        if (!dados.date || isNaN(Date.parse(dados.date))) {
            erros.push("date é obrigatória e deve ser uma data válida");
        }
    }

    return erros;
}


// =======================================
// BUSCAR TRANSAÇÕES DO USUÁRIO LOGADO
// =======================================

router.get("/", auth, async (req, res) => {

    try {

        const transactions = await Transaction.findAll({

            where: {
                userId: req.user.id
            },

            order: [
                ["id", "DESC"]
            ]

        });

        res.json(transactions);

    } catch (error) {

        console.error("Erro ao buscar transações:", error);

        res.status(500).json({
            erro: "Erro ao buscar transações"
        });

    }

});


// =======================================
// CRIAR TRANSAÇÃO
// =======================================

router.post("/", auth, async (req, res) => {

    try {

        const dados = extrairCamposPermitidos(req.body);

        const erros = validarTransacao(dados, { exigirTodos: true });

        if (erros.length > 0) {
            return res.status(400).json({ erro: erros.join("; ") });
        }

        const transaction = await Transaction.create({
            ...dados,
            userId: req.user.id
        });

        res.status(201).json(transaction);

    } catch (error) {

        console.error("Erro ao criar transação:", error);

        res.status(500).json({
            erro: "Erro ao criar transação"
        });

    }

});


// =======================================
// DELETAR
// =======================================

router.delete("/:id", auth, async (req, res) => {

    try {

        const apagada = await Transaction.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (apagada === 0) {
            return res.status(403).json({
                erro: "Essa transação não pertence a você"
            });
        }

        res.json({
            mensagem: "Transação removida"
        });

    } catch (error) {

        console.error("Erro ao remover transação:", error);

        res.status(500).json({
            erro: "Erro ao remover"
        });

    }

});


// =======================================
// EDITAR
// =======================================

router.put("/:id", auth, async (req, res) => {

    try {

        const dados = extrairCamposPermitidos(req.body);

        const erros = validarTransacao(dados, { exigirTodos: false });

        if (erros.length > 0) {
            return res.status(400).json({ erro: erros.join("; ") });
        }

        const atualizada = await Transaction.update(
            dados,
            {
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            }
        );

        if (atualizada[0] === 0) {
            return res.status(403).json({
                erro: "Você não pode editar essa transação"
            });
        }

        res.json({
            mensagem: "Atualizada"
        });

    } catch (error) {

        console.error("Erro ao atualizar transação:", error);

        res.status(500).json({
            erro: "Erro ao atualizar"
        });

    }

});


module.exports = router;
