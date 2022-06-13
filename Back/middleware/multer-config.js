const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp',
  'image/tiff': 'tiff',
  'image/svg': 'svg',
  'image/x-icon': 'ico',
  'image/xml': 'xml',
};

// storage pour indiquer à multer où enregistrer les fichiers entrants
// diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({ 
    // destionation pour indiquer a multer d'enregistrer le fichier dans le dossier images
  destination: (req, file, callback) => { 
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // On remplace les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]; // constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
    callback(null, name + Date.now() + '.' + extension); // ajouter un timestamp Date.now() comme nom de fichier
  }
});

// nous gérerons uniquement les téléchargements de fichiers image
module.exports = multer({storage: storage}).single('image');