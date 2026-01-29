const express = require('express');
const app = express();
const port = 3000;
const users = require('./modules/users');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur l'API TCG",
        data: {}
    });
});

app.post("/register", users.RegisterUser);
app.post("/login", users.Login);
app.patch("/user", users.Update);
app.post("/disconnect", users.Disconnect);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
