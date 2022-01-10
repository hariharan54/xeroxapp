const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");


const store = sequelize.define("store", {
  store_id: {
    type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
  },
  upi_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  store_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  store_address:{
      type:DataTypes.TEXT,
      allowNull:false
  },
  admin_password:{
      type:DataTypes.STRING,
      allowNull:false
  }
});

module.exports = store;