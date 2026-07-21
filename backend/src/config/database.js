const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",

        dialectOptions:{
            ssl:{
                require:true,
                rejectUnauthorized:false
            }
        },

        // Pool de conexões: evita abrir uma conexão nova a cada
        // requisição (caro) e evita esgotar o limite de conexões
        // do MySQL sob carga. Valores padrão do Sequelize já eram
        // razoáveis (max 5), deixamos explícito e configurável.
        pool:{
            max: Number(process.env.DB_POOL_MAX) || 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        logging:false
    }
);


module.exports = sequelize;