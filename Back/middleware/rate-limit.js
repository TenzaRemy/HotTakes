// Utiliser pour limiter le nombre de requêtes effectuées par un utilisateur (Attaques de type "Brute Force")
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // 20 essais
    standardHeaders: true,
  });

module.exports = limiter;