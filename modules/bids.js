const fs = require("fs");
const path = require("path");

function CreateBid(req, res) {

    const token = req.headers.authorization;
    const cardId = parseInt(req.body.card_id);

    if (!token || !cardId) {
        return res.status(400).json({ message: "Erreur : données manquantes" });
    }

    const users = load("users.json");
    const cards = load("cards.json");
    const bids = load("bids.json");

    const user = users.find(u => u.token === token);

    if (!user) {
        return res.status(401).json({ message: "Erreur : Token invalide" });
    }

    // Vérifier que l'utilisateur possède la carte
    const owned = user.collection.find(c => c.id === cardId);

    if (!owned || owned.nb < 1) {
        return res.status(400).json({ message: "Erreur : Vous ne possédez pas cette carte" });
    }

    // Retirer la carte de la collection
    owned.nb--;
    if (owned.nb === 0) {
        user.collection = user.collection.filter(c => c.id !== cardId);
    }

    // Créer l'enchère
    const newBid = {
        id: bids.length + 1,
        card_id: cardId,
        seller_id: user.id,
        end_date: Date.now() + 5 * 60 * 1000, // 5 minutes
        bidder_id: null,
        bid: 0
    };

    bids.push(newBid);

    save("users.json", users);
    save("bids.json", bids);

    res.json({
        message: "Enchère créée",
        data: newBid
    });
}


module.exports = { CreateBid };
