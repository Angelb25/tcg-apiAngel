const fs = require('fs');
const path = require('path');
const TokenGenerator = require('uuid-token-generator');

function RegisterUser(req, res) {
    
    // Récupérer les données envoyées
    if (!req.body) {
        return res.status(400).json({ message: "Erreur : Aucune donnée" });
    }

    const { id, username, password, collection } = req.body;

    try {
        const filePath = path.join(__dirname, '../data/users.json');

        // Lire le json pour récupérer les utilisateurs (synchrone)
        const fileData = fs.readFileSync(filePath, 'utf8');
        let users = JSON.parse(fileData);

        // Ajouter le nouvel utilisateur dans la liste
        const newUser = {
            id,
            username,
            password,
            collection
        };

        users.push(newUser);

        // Enregistrer la nouvelle liste
        fs.writeFileSync(
            filePath,
            JSON.stringify(users, null, 2),
            'utf8'
        );

        res.json({
            message: "Utilisateur enregistré avec succès",
            user: newUser
        });

    } catch (error) {
        console.error(error);
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

module.exports = { RegisterUser, Login };
