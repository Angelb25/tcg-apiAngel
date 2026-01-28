const fs = require('fs');
const path = require('path');

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

module.exports = { RegisterUser };
