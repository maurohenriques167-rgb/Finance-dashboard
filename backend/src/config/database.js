const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "finance_dashboard",
    "finance_user",
    "6N4f879646*",
    {
        host: "localhost",
        dialect: "mysql"
    }
);

module.exports = sequelize;