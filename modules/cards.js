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

function OpenBooster(req, res) {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({
            message: "Erreur : Token manquant"
        });
    }

    try {
        const usersData = fs.readFileSync("data/users.json", "utf-8");
        const users = JSON.parse(usersData);

        const user = users.find(u => u.token === token);

        if (!user) {
            return res.status(401).json({
                message: "Erreur : Token invalide"
            });
        }

        const fivemin = 5 * 60 * 1000;

        if (user.lastBooster && Date.now() - user.lastBooster < fivemin) {
            return res.status(429).json({
                message: "Veuillez attendre avant d’ouvrir un nouveau booster"
            });
        }

        if (!user.collection) {
            user.collection = [];
        }

        const cardsData = fs.readFileSync("data/cards.json", "utf-8");
        const cards = JSON.parse(cardsData);

        const booster = [];

        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * cards.length);
            const card = cards[randomIndex];

            booster.push(card);
            user.collection.push(card.id);
        }

        user.lastBooster = Date.now();

        fs.writeFileSync(
            "data/users.json",
            JSON.stringify(users, null, 2)
        );

        return res.json({
            message: "Booster ouvert avec succès",
            cards: booster
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

module.exports = { OpenBooster };


module.exports = { GetCards, OpenBooster };
