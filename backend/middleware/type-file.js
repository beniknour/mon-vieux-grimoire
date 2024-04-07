const fs = require('fs');
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const typeFile = (req, res, next) => {

  const extension = MIME_TYPES[req.file.mimetype];
  if (!extension) {
      console.log('Type de fichier non valide.');
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression du fichier:', err);
        }
      });
      return res.status(400).json({ message: 'Type du fichier non valide.' });
  }

  next();
};

module.exports = typeFile;
