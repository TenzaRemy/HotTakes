const Sauce = require('../models/Sauce');

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
        likes: 0, 
        dislikes: 0, 
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save() // Enregistre la sauce
    .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // renvoie un status 201 puis un message.
    .catch(error => res.status(400).json({ error })) // renvoie un status 400 et l'erreur
};

// Modifier une sauce et la mettre à jour dans la base de données seulement possible par l'auteur de la sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {  ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    if (req.file) { 
    // On cherche la sauce à modifier dans la base de données avec findOne() et UpdateOne() 
      Sauce.findOne({ _id: req.params.id }) 
      .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          // fs.unlink pour supprimer le fichier
          fs.unlink(`images/${filename}`, () => { 
          });
      })
      .catch(error => res.status(500).json({ error }));
    }
    Sauce.updateOne({_id: req.params.id}, {$set: sauceObject})
    .then(() => {res.status(200).json({message: 'Sauce modifiée !'});
    })
    .catch((error) => {res.status(400).json({ error: error});
    });
};

// Supprimer une sauce de la base de données seulement possible par l'auteur de la sauce
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
    // Si l'utilisateur like la sauce on l'ajoute à la liste des likes de la sauce
    if (req.body.like === 1) { 
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Ajout Like' }))
            .catch(error => res.status(400).json({ error }));

    // Si l'utilisateur dislike la sauce on l'ajoute à la liste des dislikes de la sauce
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Ajout Dislike' }))
            .catch(error => res.status(400).json({ error }));

    // Si l'utilisateur souhaite enlever son like ou son dislike on le supprime de la liste
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
    if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
            .then((sauce) => { res.status(200).json({ message: 'Suppression Like' }) })
            .catch(error => res.status(400).json({ error }));

    } else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
            .then((sauce) => { res.status(200).json({ message: 'Suppression Dislike' }) })
            .catch(error => res.status(400).json({ error }));
        }})
            .catch(error => res.status(400).json({ error }));
    }
}