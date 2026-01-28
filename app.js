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