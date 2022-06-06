const Sauce = require('../models/sauce');

// Module fs pour la gestion des fichiers
const fs = require('fs');

// Lire toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((Sauces) => {
        res.status(200).json(Sauces);
      })
      .catch((error) => {
        res.status(400).json({error: error});
      }
    );
  };

// Lire une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((Sauce) => {
        res.status(200).json(Sauce);
      })
      .catch((error) => {
        res.status(404).json({error: error});
      }
    );
  };

// Créer une sauce
exports.createSauce = (req, res, next) => {
    // Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, // // L'opérateur spread prend l'intégralité des éléments dans le req.body.sauce
        // Pour l'URL de l'image utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ). 
        // Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). 
        // Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    
        // On initialise les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides
        like: 0,
        dislike: 0,
        usersliked: [],
        usersdisliked: [],
    });
    sauce.save()
    .then(() => {
        res.status(201).json({
            message: 'Sauce enregistrée !'
        });
    })
    .catch((error) => {
        res.status(400).json({
            error: error
        });
    });
}

