const fs = require('fs');
const path = require('path');
const TokenGenerator = require('uuid-token-generator');

function RegisterUser(req, res) {

    // Pas de données envoyées
    if (!req.body) {
        return res.status(400).json({ message: "Erreur : Aucune donnée" });
    }

    const { username, password, collection } = req.body;

    // Username ou mot de passe absent
    if (!username || !password) {
        return res.status(400).json({ message: "Erreur : Données manquantes" });
    }

    try {
        const filePath = path.join(__dirname, '../data/users.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        let users = JSON.parse(fileData);

        // Utilisateur déjà existant
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({
                message: "Erreur : Utilisateur déjà existant"
            });
        }

        const newUser = {
            id: users.length + 1,
            username,
            password,
            collection
        };

        users.push(newUser);

        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        res.json({
            message: "Utilisateur enregistré avec succès"
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
}


function Login(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "Erreur : Aucune donnée" });
    }

    const { username, password } = req.body;

    try {
        const filePath = path.join(__dirname, '../data/users.json');

        // Lire le fichier json
        const fileData = fs.readFileSync(filePath, 'utf8');
        let users = JSON.parse(fileData);

        // Chercher un utilisateur
        const user = users.find(
            u => u.username === username && u.password === password
        );

        if (!user) {
            return res.status(401).json({
                message: "Identifiants incorrects"
            });
        }
        
        const tokgen = new TokenGenerator();
        const token = tokgen.generate(); // génère un token

        // Enregistrer le token dans l'utilisateur
        user.token = token;

        // Sauvegarder la nouvelle liste
        fs.writeFileSync(
            filePath,
            JSON.stringify(users, null, 2),
            'utf8'
        );

        // Réponse
        res.json({
            message: "Authentification réussie",
            data: {
                token: token
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

function Update(req, res) {

    const fileContent = fs.readFileSync("data/users.json", "utf-8");
    const usersList = JSON.parse(fileContent);

    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({ message: "Erreur : Token manquant" });
    }

    for (let user of usersList) {
        if (user.token === token) {

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

    // Token invalide
    return res.status(401).json({
        message: "Erreur : Token invalide"
    });
}
function Disconnect(req, res) {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({
            message: "Erreur : Token manquant"
        });
    }

    try {
        const filePath = "data/users.json";
        const fileData = fs.readFileSync(filePath, "utf-8");
        const users = JSON.parse(fileData);

        for (let user of users) {
            if (user.token === token) {

                // Suppression du token = déconnexion
                delete user.token;

                fs.writeFileSync(
                    filePath,
                    JSON.stringify(users, null, 2)
                );

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

module.exports = { RegisterUser, Login, Update, Disconnect };
