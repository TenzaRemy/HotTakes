const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// Pour travailler avec des fichiers et chemin d'accés 
const path = require('path'); 

// Importations des routes
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user') ;

mongoose.connect('mongodb+srv://TenzaRemy:_DFR.59.remy@apifullstack.bmusk.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie ! Votre API est à présent connectée à votre base de données'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Ajout bodyParser sinon les images ne s'affichent pas
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes); 

module.exports = app;