const express = require('express')
const app = express()
const port = 3000

// Route a la racine renvoyant un message
app.get("/", (req, res) => {  
res.json( 
{  
message : "Bienvenue sur l'API TCG",  
data : {} 
} 
); 
}); 

// gérer les données des formulaires
app.use(express.urlencoded({ extended: true })); 

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});