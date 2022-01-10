const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");


const printouts = sequelize.define("printouts", {
  print_id: {
    type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  document_link: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  no_of_copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments:{
      type:DataTypes.TEXT,
      allowNull:false,
      defaultValue:"Take full print out."
  },
  print_status: {
    type:   DataTypes.ENUM,
    values: ['Received', 'Processing', 'Done']
  },
  pick_up_time:{
      type:DataTypes.DATE,
      allowNull:false
  }
});

module.exports = printouts;