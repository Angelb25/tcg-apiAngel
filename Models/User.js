const { DataTypes } = require("sequelize");
const db = require("../db");

/*Table user dans la base de données*/
const User = db.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  token: {
    type: DataTypes.STRING,
    allowNull: true
  },

  currency: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  lastBooster: {
    type: DataTypes.DATE,
    allowNull: true
  },
});

module.exports = User;
