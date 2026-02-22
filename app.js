const express = require('express');
const app = express();
const port = 3000;
const bids = require('./modules/bids');
const users = require('./modules/users');
const cards = require('./modules/cards');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur l'API TCG",
        data: {}
    });
});

app.put("/booster", cards.OpenBooster)
app.get("/cards", cards.GetCards)
app.post("/register", users.RegisterUser);
app.post("/login", users.Login);
app.patch("/user", users.Update);
app.post("/disconnect", users.Disconnect);
app.get("/user", users.GetUser);
app.post("/convert", users.Convert);
app.post("/bid", bids.CreateBid);
app.put("/bid", bids.PlaceBid);
app.get("/bid", bids.GetAllBids);
app.get("/bid/:id", bids.GetBid);
app.delete("/bid", bids.CloseBid);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
