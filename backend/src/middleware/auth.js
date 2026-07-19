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

          console.log("TOKEN RECEBIDO:", token);
          console.log("TOKEN DECODIFICADO:", decoded);
        


        req.user = decoded;


        next();



    }catch(error){


        console.log(error);


        return res.status(401).json({
            erro:"Token inválido"
        });


    }


}


module.exports = auth;