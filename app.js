const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

const db = require("./db");

// Import de module 
const bids = require('./modules/bids');
const users = require('./modules/users');
const cards = require('./modules/cards');

// Import models
const User = require("./Models/User");
const Card = require("./Models/Card");
const Bid = require("./Models/Bid");

// Synchronisation de la BDD
db.sync({ alter: true })
  .then(() => console.log("Tables synchronisées"))
  .catch(err => console.error(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration Swagger 
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TCG',
      version: '1.0.0',
      description: 'Documentation API TCG',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Route de test
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API fonctionnelle
 */
app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur l'API TCG",
        data: {}
    });
});

/**
 * @swagger
 * /booster:
 *   put:
 *     summary: Ouvrir un booster
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: Booster ouvert !
 */
app.put("/booster", cards.OpenBooster);

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Récupérer toutes les cartes
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: Liste des cartes
 */
app.get("/cards", cards.GetCards);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Inscription utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@mail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Utilisateur créé
 */
app.post("/register", users.RegisterUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
app.post("/login", users.Login);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Récupérer un utilisateur
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Infos utilisateur
 */
app.get("/user", users.GetUser);

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 */
app.patch("/user", users.Update);

/**
 * @swagger
 * /disconnect:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Déconnecté
 */
app.post("/disconnect", users.Disconnect);

/**
 * @swagger
 * /convert:
 *   post:
 *     summary: Convertir des ressources
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Conversion effectuée
 */
app.post("/convert", users.Convert);

/**
 * @swagger
 * /bid:
 *   post:
 *     summary: Créer une enchère
 *     tags: [Bids]
 *     responses:
 *       200:
 *         description: Enchère créée
 */
app.post("/bid", bids.CreateBid);

// Server
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});