const jwt = require('jsonwebtoken');

// Création du middleware auth qui va nous permettre de vérifier que l'utilisateur est bien authentifié
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
        throw new Error('Utilisateur non autorisé');
    } else {
      next();
    }
  } catch {res.status(401).json({error: new Error('Invalid request!')});
  }
};