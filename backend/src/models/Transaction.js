const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {

    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    description:{
        type:DataTypes.STRING,
        allowNull:false
    },

    amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },

    type:{
        type:DataTypes.ENUM("receita","despesa"),
        allowNull:false
    },

    date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },

    category:{
        type:DataTypes.STRING,
        allowNull:true
    },

    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }

},{

    tableName:"transactions",
    timestamps:false

});


module.exports = Transaction;