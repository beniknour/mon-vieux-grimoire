const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res, next) => {
    // Récupère le chemin du fichier
    const filePath = req.file.path;
    // Redimensionne et convertit en WebP
    sharp(filePath)
        .resize({ height: 260, width: 206 })
        .webp({ quality: 90 })
        .toFile(filePath + '.webp', (err) => {
            if (err) {
                return next(err);
            } else {
                // Supprime le fichier original après la conversion
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.log(error);
                    }
                    next();
                });
            }
        });
};
