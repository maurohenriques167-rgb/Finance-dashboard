const express = require("express");
console.log("TRANSACTIONS.JS CARREGADO");
const router = express.Router();

const auth = require("../middleware/auth");
const Transaction = require("../models/Transaction");



// ===============================
// BUSCAR TRANSAÇÕES DO USUÁRIO
// ===============================

router.get("/", auth, async(req,res)=>{

    try{


        const transactions = await Transaction.findAll({

            where:{
                userId:req.user.id
            }

        });


        res.json(transactions);



    }catch(error){


        console.log(error);


        res.status(500).json({
            erro:"Erro ao buscar transações"
        });


    }


});





// ===============================
// CRIAR TRANSAÇÃO
// ===============================

router.post("/", auth, async(req,res)=>{

    console.log("REQ.USER NO POST:", req.user);
    try{


        const transaction = await Transaction.create({

            description:req.body.description,

            amount:req.body.amount,

            type:req.body.type,

            date:req.body.date,

            category:req.body.category,

            userId:req.user.id

        });



        res.json(transaction);



    }catch(error){


        console.log(error);


        res.status(500).json({

            erro:"Erro ao criar transação"

        });


    }


});






// ===============================
// DELETAR TRANSAÇÃO
// ===============================

router.delete("/:id", auth, async(req,res)=>{

    try{


        const id = req.params.id;



        const apagada = await Transaction.destroy({

            where:{

                id:id,

                userId:req.user.id

            }

        });



        if(apagada === 0){

            return res.status(403).json({

                erro:"Você não pode apagar essa transação"

            });

        }



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







// ===============================
// EDITAR TRANSAÇÃO
// ===============================

router.put("/:id", auth, async(req,res)=>{

    try{


        const id = req.params.id;



        const atualizada = await Transaction.update(

            req.body,

            {

                where:{

                    id:id,

                    userId:req.user.id

                }

            }

        );



        if(atualizada[0] === 0){


            return res.status(403).json({

                erro:"Você não pode editar essa transação"

            });


        }




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