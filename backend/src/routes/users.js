const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


router.get("/", (req,res)=>{
    res.send("Rota de usuários funcionando");
});
// CADASTRAR USUÁRIO
router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        const existe = await User.findOne({
            where: {
                email: email
            }
        });


        if (existe) {
            return res.status(400).json({
                erro: "Email já cadastrado"
            });
        }


        const senhaHash = await bcrypt.hash(password, 10);


        const usuario = await User.create({

            name,
            email,
            password: senhaHash

        });


        res.json({

            mensagem: "Usuário criado com sucesso",
            usuario: {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email
            }

        });


    } catch(error){

        console.log(error);

        res.status(500).json({
            erro:"Erro ao cadastrar"
        });

    }

});



// LOGIN
router.post("/login", async(req,res)=>{


    try{


        const {email,password} = req.body;


        const usuario = await User.findOne({

            where:{
                email:email
            }

        });



        if(!usuario){

            return res.status(404).json({
                erro:"Usuário não encontrado"
            });

        }



        const senhaCorreta = await bcrypt.compare(
            password,
            usuario.password
        );



        if(!senhaCorreta){

            return res.status(401).json({
                erro:"Senha incorreta"
            });

        }



        const token = jwt.sign(

            {
                id: usuario.id
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );



        res.json({

            token,

            usuario:{
                id:usuario.id,
                name:usuario.name,
                email:usuario.email
            }

        });



    }catch(error){

        console.log(error);

        res.status(500).json({
            erro:"Erro no login"
        });

    }


});



module.exports = router;    