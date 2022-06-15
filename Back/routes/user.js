const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');// Importation des controllers User dans la route
const limiter = require('../middleware/rate-limit'); // Importation du middleware rate-limit 

router.post('/signup', userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;