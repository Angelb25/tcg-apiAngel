// ROUTES API 
app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur l'API TCG",
        data: {}
    });
});

app.put("/booster", cards.OpenBooster);
app.get("/cards", cards.GetCards);
app.post("/register", users.RegisterUser);
app.post("/login", users.Login);
app.patch("/user", users.Update);
app.post("/disconnect", users.Disconnect);
app.get("/user", users.GetUser);
app.post("/convert", users.Convert);
app.post("/bid", bids.CreateBid);