const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');// Importation des controllers User dans la route

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;