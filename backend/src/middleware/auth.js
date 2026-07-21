const jwt = require("jsonwebtoken");


function auth(req,res,next){


    const header = req.headers.authorization;


    if(!header){

        return res.status(401).json({
            erro:"Token não enviado"
        });

    }


    const token = header.split(" ")[1];


    try{


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;


        next();



    }catch(error){


        console.error("Falha na autenticação:", error.message);


        return res.status(401).json({
            erro:"Token inválido"
        });


    }


}


module.exports = auth;