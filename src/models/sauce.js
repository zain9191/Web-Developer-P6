// Importation de Mongoose
const mongoose = require('mongoose');

// Création d'un schéma de sauce avec les différents types de données
const sauceSchema = mongoose.Schema({ userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false, default: 0 },
  dislikes: { type: Number, required: false, default: 0 },
  usersLiked: { type: [String], required: false, default: [] }, // Change to String array
  usersDisliked: { type: [String], required: false, default: [] }, // Change to String array
});
// Exportation du modèle de sauce
module.exports = mongoose.model('Sauce', sauceSchema);
