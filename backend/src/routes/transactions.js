const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");


// Buscar todas as transações
router.get("/", async (req, res) => {

    try {

        const transactions = await Transaction.findAll();

        res.json(transactions);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            erro: "Erro ao buscar transações"
        });

    }

});


// Criar uma transação
router.post("/", async (req, res) => {

    try {

        const transaction = await Transaction.create(req.body);

        res.json(transaction);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            erro: "Erro ao criar transação"
        });

    }

});
router.delete("/:id", async (req,res)=>{

    try{

        const id = req.params.id;


        await Transaction.destroy({

            where:{
                id:id
            }

        });


        res.json({
            mensagem:"Transação removida"
        });


    }catch(error){

        console.log(error);

        res.status(500).json({
            erro:"Erro ao remover transação"
        });

    }


});
router.put("/:id", async (req,res)=>{

    try{

        const id = req.params.id;


        await Transaction.update(req.body,{

            where:{
                id:id
            }

        });


        res.json({
            mensagem:"Transação atualizada"
        });


    }catch(error){

        console.log(error);

        res.status(500).json({
            erro:"Erro ao atualizar"
        });

    }

});
module.exports = router;