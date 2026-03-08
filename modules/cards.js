// Module permettant de lire/écrire des fichiers JSON
const fs = require("fs");

//  GETCARDS 
function GetCards(req, res) {

    try {
        // Lecture du fichier contenant toutes les cartes
        const fileData = fs.readFileSync("data/cards.json", "utf-8");
        const cards = JSON.parse(fileData);

        // Réponse JSON
        return res.json({
            message: "Liste des cartes",
            data: cards
        });

    } catch (error) {
        // Erreur de lecture du fichier
        return res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

//  getRandomRarity 
function getRandomRarity() {

    // Nombre aléatoire entre 0 et 100
    const roll = Math.random() * 100;

    if (roll < 80) return "common";

    if (roll < 95) return "rare";

    return "legendary";
}

//  OPENBOOSTER
function OpenBooster(req, res) {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({
            message: "Erreur : Token manquant"
        });
    }

    try {
        // Lecture des utilisateurs
        const usersData = fs.readFileSync("data/users.json", "utf-8");
        const users = JSON.parse(usersData);

        // Trouver l'utilisateur correspondant au token
        const user = users.find(u => u.token === token);

        if (!user) {
            return res.status(401).json({
                message: "Erreur : Token invalide"
            });
        }

        // Délai de 5 minutes 
        const fivemin = 5 * 60 * 1000;

        if (user.lastBooster && Date.now() - user.lastBooster < fivemin) {
            return res.status(429).json({
                message: "Veuillez attendre avant d’ouvrir un nouveau booster"
            });
        }

        // Lecture des cartes disponibles
        const cardsData = fs.readFileSync("data/cards.json", "utf-8");
        const cards = JSON.parse(cardsData);

        const booster = [];

        // Un booster contient 5 cartes
        for (let i = 0; i < 5; i++) {

            // Tirage de la rareté
            const rarity = getRandomRarity();

            // Filtrer les cartes de cette rareté
            const cardsByRarity = cards.filter(card => card.rarity === rarity);

            // Choisir une carte au hasard dans cette rareté
            const randomIndex = Math.floor(Math.random() * cardsByRarity.length);
            const card = cardsByRarity[randomIndex];

            // Ajouter au booster
            booster.push(card);

            // Gestion des doublons dans la collection du joueur
            let existing = user.collection.find(c => c.id === card.id);

            if (existing) {
                existing.nb++; // Il en possède déjà → on augmente le nombre
            } else {
                user.collection.push({ id: card.id, nb: 1 }); // Nouvelle carte
            }
        }

        // Mise à jour du timestamp du dernier booster ouvert
        user.lastBooster = Date.now();

        // Sauvegarde des modifications
        fs.writeFileSync("data/users.json", JSON.stringify(users, null, 2));

        // Réponse
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

//  EXPORT DES FONCTIONS
module.exports = { GetCards, OpenBooster, getRandomRarity };
