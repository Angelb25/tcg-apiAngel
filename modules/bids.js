const fs = require("fs");
const path = require("path");

function load(file) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "../data/" + file), "utf-8"));
}

function save(file, data) {
    fs.writeFileSync(path.join(__dirname, "../data/" + file), JSON.stringify(data, null, 2));
}

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

function PlaceBid(req, res) {

    const token = req.headers.authorization;
    const bidId = parseInt(req.body.bid_id);
    const amount = parseInt(req.body.amount);

    if (!token || !bidId || !amount) {
        return res.status(400).json({ message: "Erreur : données manquantes" });
    }

    const users = load("users.json");
    const bids = load("bids.json");

    const user = users.find(u => u.token === token);
    const bid = bids.find(b => b.id === bidId);

    if (!user) return res.status(401).json({ message: "Erreur : Token invalide" });
    if (!bid) return res.status(404).json({ message: "Erreur : Enchère introuvable" });

    if (Date.now() > bid.end_date) {
        return res.status(400).json({ message: "Erreur : Enchère terminée" });
    }

    if (user.id === bid.seller_id) {
        return res.status(400).json({ message: "Erreur : Vous êtes le vendeur" });
    }

    if (amount <= bid.bid) {
        return res.status(400).json({ message: "Erreur : Montant trop faible" });
    }

    if (user.currency < amount) {
        return res.status(400).json({ message: "Erreur : Monnaie insuffisante" });
    }

    // Rembourser l'enchérisseur
    if (bid.bidder_id) {
        const oldBidder = users.find(u => u.id === bid.bidder_id);
        oldBidder.currency += bid.bid;
    }

    // Débiter le nouvel enchérisseur
    user.currency -= amount;

    // Mettre à jour l'enchère
    bid.bid = amount;
    bid.bidder_id = user.id;

    save("users.json", users);
    save("bids.json", bids);

    res.json({ message: "Enchère placée", data: bid });
}

function GetAllBids(req, res) {
    const bids = load("bids.json");
    res.json({ message: "Liste des enchères", data: bids });
}

function GetBid(req, res) {
    const id = parseInt(req.query.id);
    const bids = load("bids.json");

    const bid = bids.find(b => b.id === id);

    if (!bid) return res.status(404).json({ message: "Enchère introuvable" });

    res.json({ message: "Enchère trouvée", data: bid });
}

function CloseBid(req, res) {

    const token = req.headers.authorization;
    const bidId = parseInt(req.body.bid_id);

    if (!token || !bidId) {
        return res.status(400).json({ message: "Erreur : données manquantes" });
    }

    const users = load("users.json");
    const bids = load("bids.json");

    const user = users.find(u => u.token === token);
    const bid = bids.find(b => b.id === bidId);

    if (!user) return res.status(401).json({ message: "Erreur : Token invalide" });
    if (!bid) return res.status(404).json({ message: "Erreur : Enchère introuvable" });

    if (Date.now() < bid.end_date) {
        return res.status(400).json({ message: "Erreur : Enchère non terminée" });
    }

    if (user.id !== bid.seller_id && user.id !== bid.bidder_id) {
        return res.status(403).json({ message: "Erreur : Vous ne pouvez pas clôturer cette enchère" });
    }

    // Si personne n'a enchéri alorsrendre la carte au vendeur
    if (!bid.bidder_id) {
        const seller = users.find(u => u.id === bid.seller_id);
        seller.collection.push({ id: bid.card_id, nb: 1 });
    } else {
        // monnaie au vendeur
        const seller = users.find(u => u.id === bid.seller_id);
        seller.currency += bid.bid;

        // carte au gagnant
        const winner = users.find(u => u.id === bid.bidder_id);
        let owned = winner.collection.find(c => c.id === bid.card_id);

        if (owned) owned.nb++;
        else winner.collection.push({ id: bid.card_id, nb: 1 });
    }

    // Supprimer l'enchère
    const updated = bids.filter(b => b.id !== bidId);

    save("users.json", users);
    save("bids.json", updated);

    res.json({ message: "Enchère clôturée" });
}

module.exports = { CreateBid, PlaceBid, GetAllBids, GetBid, CloseBid };
