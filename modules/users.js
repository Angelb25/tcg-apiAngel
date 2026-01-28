const fs = require('fs');

function RegisterUser(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "Erreur : Aucune donnée" });
    }

    const { username, password, collection } = req.body;

    // lire le json des utilisateurs
    try {
        const data = fs.readFileSync('./data/users.json', 'utf8');

        console.log(data)

        res.json({ message: "OK" });
    } catch (err) {
        console.error("erreur");
    }
}

module.exports = { RegisterUser };
