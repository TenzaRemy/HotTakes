const express = require('express'); // Importation d'express
const mongoose = require('mongoose'); // Importation de Mongoose

// Importation d'helmet pour protéger les vulnérabilités connues d'express 
const helmet = require('helmet');

const cors = require('cors');

const userRoutes = require('./routes/user');// Importation des routes User

const path = require('path');

const app = express();

// Connecter l'API à la base de données MongoDB
mongoose.connect('mongodb+srv://TenzaRemy:_DFR.59.remy@apifullstack.bmusk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
    // Permet de savoir si la connexion est réussie ou échouée avec un message dans la console
  .then(() => console.log('Connexion à MongoDB réussie ! Votre API est à présent connectée à votre base de données'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// intercepte la requete et la transforme au bon format (remplace app.use(bodyParser.json()) par app.use(express.json()))
app.use(express.json());

// contre sécurité CORS puisque de base le site qui utilise l'API doit uniquement  des requêtes vers la même origine que celle ci
app.use(cors());

app.use(helmet());

// Chemin statique ajouté à l'application pour fournir les images
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/auth', userRoutes); 

module.exports = app;