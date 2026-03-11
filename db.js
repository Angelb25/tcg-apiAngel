const { Sequelize } = require("sequelize");

/* Connexion a la bdd */
const db = new Sequelize("tcg", "postgres", "Enzo.2508", {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

/* Test */
db.authenticate()
  .then(() => console.log("Connexion PostgreSQL OK"))
  .catch(err => console.error("Erreur connexion PostgreSQL :", err));

module.exports = db;
