const jwt = require('jsonwebtoken');

// Création du middleware auth qui va nous permettre de vérifier que l'utilisateur est bien authentifié
module.exports = (req, res, next) => {
  try {
    // on extrait le token du header d'auth de la requete et fonction split pour récupérer le Bearer token
    const token = req.headers.authorization.split(' ')[1];
    // On décode le token en vérifiant qu'il correspond bien avec sa clé secrete
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // La clé décodée est récupéré 
    const userId = decodedToken.userId;
    // Du coup s'il y a un des id qui est différent entre  la requete et le token alors l'accès n'est pas autorisé
    if (req.body.userId && req.body.userId !== userId) {
        throw new Error('Utilisateur non autorisé');
    // Sinon on continue le traitement de la requete puisque l'accès est autorisé
    } else {
      next();
    }
  } catch {res.status(401).json({error: new Error('Invalid request!')});
  }
};