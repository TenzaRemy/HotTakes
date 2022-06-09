const Sauce = require('../models/sauce');

// Module fs pour la gestion des fichiers
const fs = require('fs');

// Lire toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((Sauces) => {res.status(200).json(Sauces);})

      .catch((error) => {res.status(400).json({error: error});
      });
  };

// Lire une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((Sauce) => {res.status(200).json(Sauce);})

      .catch((error) => {res.status(404).json({error: error});
      });
  };

// Créer une sauce
exports.createSauce = (req, res, next) => {
    // Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({

        // L'opérateur spread prend l'intégralité des éléments dans le req.body.sauce
        ...sauceObject, 

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
    Sauce.save()
    .then(() => {res.status(201).json({message: 'Sauce enregistrée !'});
    })
    .catch((error) => {res.status(400).json({ error: error});
    });
}

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    if (req.file) { 
      Sauce.findOne({ _id: req.params.id }) // On récupère la sauce à modifier qui correspond à l'id de la requête
      .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1]; // On récupère le nom du fichier à supprimer 
          fs.unlink(`images/${filename}`, () => { // fs.unlink pour supprimer le fichier
          });
      })
      // message d'erreur si la récupération de la sauce n'a pu être faite
      .catch(error => res.status(500).json({ error }));
  }
    Sauce.updateOne({_id: req.params.id}, {$set: sauceObject})
    .then(() => {res.status(200).json({message: 'Sauce modifiée !'});
    })
    .catch((error) => {res.status(400).json({ error: error});
    });
}

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // On cherche le fichier correspondant à l'URL et on le supprime
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  }; 

// Statut "like" et "dislike" d'une sauce 
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // On vérifie si l'utilisateur n'a pas déjà liké la sauce 
        if (sauce.usersliked.includes(req.body.userId)) { 
          res.status(400).json({ error: 'Vous avez déjà liké cette sauce !' }); 
        } else { 
          Sauce.updateOne({ _id: req.params.id }, { $inc: { like: 1 }, $push: { usersliked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Sauce likée !' }))
            .catch(error => res.status(400).json({ error }));
        }
        // On vérifie aussi si l'utilisateur n'a pas déjà disliké la sauce
        if (sauce.usersdisliked.includes(req.body.userId)) {
            res.status(400).json({ error: 'Vous avez déjà disliké cette sauce !' });
         } else { 
         Sauce.updateOne({ _id: req.params.id }, { $inc: { dislike: 1 }, $push: { usersdisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
            .catch(error => res.status(400).json({ error }));
            }
            }) 
        .catch(error => res.status(500).json({ error }));
        }

