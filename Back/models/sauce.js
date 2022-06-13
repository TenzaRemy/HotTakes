const mongoose = require('mongoose'); // J'importe mongoose

const sauceSchema = mongoose.Schema({ // Je crée le schema et définit sont contenu
  userId: { type: String, required: true},
  name: { type: String, required: true },
  manufacturer: { type: String, required: true},
  description: { type: String, required: true },
  mainPepper: { type: String, required: true},
  imageUrl: { type: String, required: true},
  heat: { type: Number, required: true},
  likes: { type: Number, required: true},
  dislikes: { type: Number, required: true},
  usersLiked: { type: Array, required: true},
  usersDisliked: { type: Array, required: true},}
);

module.exports = mongoose.model('sauce', sauceSchema); // J'exporte le schema