const fs = require("fs");

function GetCards(req, res) {

    try {
        const fileData = fs.readFileSync("data/cards.json", "utf-8");
        const cards = JSON.parse(fileData);

        return res.json({
            message: "Liste des cartes",
            data: cards
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

module.exports = { GetCards };
