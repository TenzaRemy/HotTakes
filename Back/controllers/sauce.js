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


