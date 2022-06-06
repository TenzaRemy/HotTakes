const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

//Renvoie un tableau de toutes les sauces de la base de données.
router.get('/', sauceCtrl.getAllSauces);

//Renvoie la sauce avec l’_id fourni
router.get('/:id', sauceCtrl.getOneSauce);

// Capture et enregistre l'image, analyse la sauce transformée en chaîne de caractères et l'enregistre 
// dans la base de données en définissant correctement son imageUrl
router.post('/', sauceCtrl.createSauce);

// Met à jour la sauce avec l'_id fourni. Si une image est téléchargée, elle est capturée
// et l’imageUrl de la sauce est mise à jour.
router.put('/:id', sauceCtrl.modifySauce);

// Supprime la sauce avec l'_id fourni
router.delete('/:id', sauceCtrl.deleteSauce);

// 
router.post('/:id/like', sauceCtrl.likeSauce);

