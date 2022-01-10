const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");


const payments = sequelize.define("payments", {
  pymt_id: {
    type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
  },
  print_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment_reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

module.exports = payments;