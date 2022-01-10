const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");


const customers = sequelize.define("customers", {
  email_id: {
    type: DataTypes.STRING,
        allowNull:false,
        primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = customers;