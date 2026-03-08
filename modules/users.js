// Import des modules nécessaires
const fs = require('fs');                 // lire/écrire les fichiers JSON
const path = require('path');             // gérer les chemins de fichiers
const TokenGenerator = require('uuid-token-generator'); // générer des tokens uniques

//  GET USER 
function GetUser(req, res) {

    const token = req.headers.authorization; // Token envoyé dans les headers

    // Aucun token fourni
    if (!token) {
        return res.status(400).json({
            message: "Erreur : Token manquant"
        });
    }

    try {
        // Lecture du fichier users.json
        const filePath = path.join(__dirname, '../data/users.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const users = JSON.parse(fileData);

        // Recherche de l'utilisateur correspondant au token
        const user = users.find(u => u.token === token);

        // Aucun utilisateur trouvé
        if (!user) {
            return res.status(401).json({
                message: "Erreur : Token invalide"
            });
        }

        // renvoie d'un utilisateur 
        const safeUser = {
            id: user.id,
            username: user.username,
            collection: user.collection,
            currency: user.currency,
            lastBooster: user.lastBooster
        };

        return res.json({
            message: "Utilisateur trouvé",
            data: safeUser
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

//  REGISTER 
function RegisterUser(req, res) {

    // Aucune donnée envoyée
    if (!req.body) {
        return res.status(400).json({ message: "Erreur : Aucune donnée" });
    }

    const { username, password, collection } = req.body;

    // Champs obligatoires manquants
    if (!username || !password) {
        return res.status(400).json({ message: "Erreur : Données manquantes" });
    }

    try {
        const filePath = path.join(__dirname, '../data/users.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        let users = JSON.parse(fileData);

        // Vérifier si le username existe déjà
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({
                message: "Erreur : Utilisateur déjà existant"
            });
        }

        // Création du nouvel utilisateur
        const newUser = {
            id: users.length + 1,
            username,
            password,
            collection
        };

        users.push(newUser);

        // Sauvegarde dans le fichier
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        res.json({
            message: "Utilisateur enregistré avec succès"
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
}

//  LOGIN 
function Login(req, res) {

    if (!req.body) {
        return res.status(400).json({ message: "Erreur : Aucune donnée" });
    }

    const { username, password } = req.body;

    try {
        const filePath = path.join(__dirname, '../data/users.json');

        // Lecture du fichier
        const fileData = fs.readFileSync(filePath, 'utf8');
        let users = JSON.parse(fileData);

        // Recherche d'un utilisateur correspondant
        const user = users.find(
            u => u.username === username && u.password === password
        );

        // Identifiants incorrects
        if (!user) {
            return res.status(401).json({
                message: "Identifiants incorrects"
            });
        }

        // Génére d'un token unique
        const tokgen = new TokenGenerator();
        const token = tokgen.generate();

        // Enregistrement du token dans l'utilisateur
        user.token = token;

        // Sauvegarde
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');

        // Réponse
        res.json({
            message: "Authentification réussie",
            data: { token }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

//  UPDATE 
function Update(req, res) {

    const fileContent = fs.readFileSync("data/users.json", "utf-8");
    const usersList = JSON.parse(fileContent);

    const token = req.headers.authorization;

    // Aucun token fourni
    if (!token) {
        return res.status(400).json({ message: "Erreur : Token manquant" });
    }

    // Recherche de l'utilisateur
    for (let user of usersList) {
        if (user.token === token) {

            // Mise à jour du username
            if (req.body.username) {
                user.username = req.body.username;

                fs.writeFileSync(
                    "data/users.json",
                    JSON.stringify(usersList, null, 2)
                );

                return res.json({
                    message: "OK, new username is : " + user.username
                });
            }
        }
    }

    // Aucun utilisateur trouvé
    return res.status(401).json({
        message: "Erreur : Token invalide"
    });
}

//  DISCONNECT 
function Disconnect(req, res) {

    const token = req.headers.authorization;

    // Aucun token fourni
    if (!token) {
        return res.status(400).json({
            message: "Erreur : Token manquant"
        });
    }

    try {
        const filePath = "data/users.json";
        const fileData = fs.readFileSync(filePath, "utf-8");
        const users = JSON.parse(fileData);

        // Recherche de l'utilisateur
        for (let user of users) {
            if (user.token === token) {

                // Suppression du token = déconnexion
                delete user.token;

                fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

                return res.json({
                    message: "Déconnexion réussie"
                });
            }
        }

        // Token invalide
        return res.status(401).json({
            message: "Erreur : Token invalide"
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

//  CONVERT
function Convert(req, res) {

    const token = req.headers.authorization;
    const cardId = parseInt(req.body.card_id);

    // Vérification du token
    if (!token) {
        return res.status(400).json({
            message: "Erreur : Token manquant"
        });
    }

    // Vérification de l'id de la carte
    if (!cardId) {
        return res.status(400).json({
            message: "Erreur : id de carte manquant"
        });
    }

    try {
        const usersPath = path.join(__dirname, "../data/users.json");
        const cardsPath = path.join(__dirname, "../data/cards.json");

        const usersData = fs.readFileSync(usersPath, "utf-8");
        const cardsData = fs.readFileSync(cardsPath, "utf-8");

        const users = JSON.parse(usersData);
        const cards = JSON.parse(cardsData);

        // Trouver l'utilisateur
        const user = users.find(u => u.token === token);

        if (!user) {
            return res.status(401).json({
                message: "Erreur : Token invalide"
            });
        }

        // Vérifie que l'utilisateur possède la carte
        const verif = user.collection.find(c => c.id === cardId);

        if (!verif) {
            return res.status(400).json({
                message: "Erreur : Vous ne possédez pas cette carte"
            });
        }

        // Vérifie qu'il en possède au moins 2
        if (verif.nb < 2) {
            return res.status(400).json({
                message: "Erreur : Impossible de convertir, vous devez avoir au moins 2 exemplaires"
            });
        }

        // Trouve la carte dans lejson
        const card = cards.find(c => c.id === cardId);

        if (!card) {
            return res.status(400).json({
                message: "Erreur : Carte introuvable"
            });
        }

        // Valeurs de conversion selon rareté
        const conversionValues = {
            "common": 1,
            "rare": 5,
            "legendary": 20
        };

        const gain = conversionValues[card.rarity] || 1;

        // Mise à jour de la monnaie
        user.currency += gain;

        // Sauvegarde
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        return res.json({
            message: "Conversion réussie",
            data: {
                card_id: cardId,
                rarity: card.rarity,
                gain: gain,
                new_currency: user.currency
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// EXPORT DES FONCTIONS
module.exports = { RegisterUser, Login, Update, Disconnect, GetUser, Convert };
