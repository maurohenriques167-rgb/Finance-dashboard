const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Transaction = require("../models/Transaction");

console.log("TRANSACTIONS.JS CARREGADO");


// =======================================
// BUSCAR TRANSAÇÕES DO USUÁRIO LOGADO
// =======================================

router.get("/", auth, async(req,res)=>{

    try{

        console.log("===== GET TRANSAÇÕES =====");
        console.log("USUÁRIO:", req.user);


        const transactions = await Transaction.findAll({

            where:{
                userId:req.user.id
            },

            order:[
                ["id","DESC"]
            ]

        });


        console.log(
            "TRANSAÇÕES ENCONTRADAS:",
            transactions
        );


        res.json(transactions);



    }catch(error){

        console.log(error);


        res.status(500).json({

            erro:"Erro ao buscar transações"

        });

    }


});





// =======================================
// CRIAR TRANSAÇÃO
// =======================================

router.post("/", auth, async(req,res)=>{


    try{


        console.log("===== POST TRANSAÇÃO =====");

        console.log(
            "USUÁRIO:",
            req.user
        );


        console.log(
            "BODY:",
            req.body
        );



        const transaction = await Transaction.create({


            description:req.body.description,

            amount:req.body.amount,

            type:req.body.type,

            date:req.body.date,

            category:req.body.category,


            userId:req.user.id


        });



        console.log(
            "CRIADA:",
            transaction
        );



        res.json(transaction);



    }catch(error){


        console.log(error);


        res.status(500).json({

            erro:"Erro ao criar transação"

        });


    }


});






// =======================================
// DELETAR
// =======================================


router.delete("/:id", auth, async(req,res)=>{


    try{


        const apagada = await Transaction.destroy({


            where:{


                id:req.params.id,

                userId:req.user.id


            }


        });



        if(apagada === 0){

            return res.status(403).json({

                erro:"Essa transação não pertence a você"

            });

        }



        res.json({

            mensagem:"Transação removida"

        });



    }catch(error){


        console.log(error);


        res.status(500).json({

            erro:"Erro ao remover"

        });


    }


});






// =======================================
// EDITAR
// =======================================


router.put("/:id", auth, async(req,res)=>{


    try{


        const atualizada = await Transaction.update(


            req.body,


            {

                where:{


                    id:req.params.id,

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

            mensagem:"Atualizada"

        });



    }catch(error){


        console.log(error);


        res.status(500).json({

            erro:"Erro ao atualizar"

        });


    }


});





module.exports = router;