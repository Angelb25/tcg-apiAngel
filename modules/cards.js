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

function getRandomRarity() {
    const roll = Math.random() * 100;

    if (roll < 80) return "common";
    if (roll < 95) return "rare";
    return "legendary";
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

        // Délai 5 minutes
        const fivemin = 5 * 60 * 1000;

        if (user.lastBooster && Date.now() - user.lastBooster < fivemin) {
            return res.status(429).json({
                message: "Veuillez attendre avant d’ouvrir un nouveau booster"
            });
        }

        const cardsData = fs.readFileSync("data/cards.json", "utf-8");
        const cards = JSON.parse(cardsData);

        const booster = [];

        for (let i = 0; i < 5; i++) {

            const rarity = getRandomRarity();
            const cardsByRarity = cards.filter(card => card.rarity === rarity);

            const randomIndex = Math.floor(Math.random() * cardsByRarity.length);
            const card = cardsByRarity[randomIndex];

            booster.push(card);

            // Gestion des doublons
            let existing = user.collection.find(c => c.id === card.id);

            if (existing) {
                existing.nb++;
            } else {
                user.collection.push({ id: card.id, nb: 1 });
            }
        }

        user.lastBooster = Date.now();

        fs.writeFileSync("data/users.json", JSON.stringify(users, null, 2));

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

module.exports = { GetCards, OpenBooster, getRandomRarity };


function getRandomRarity() { const roll = Math.random() * 100; 
    if (roll < 80) return "common"; 
    if (roll < 95) return "rare"; 
    return "legendary"; }


module.exports = { GetCards, OpenBooster, getRandomRarity };
