const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
    // Récupère le chemin du fichier
    const filePath = req.file ? req.file.path : null;
    
    // Vérifie si un fichier a été téléchargé
    if (filePath) {
        console.log(filePath);
        // Redimensionne et convertit en WebP
        sharp(filePath)
            .resize({ height: 595, width: 463 })
            .webp({ quality: 90 })
            .toFile(filePath.split(".")[0] + '.webp', (err) => {
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
    } else {
        // Si aucun fichier n'a été téléchargé on passe à la prochaine étape
        next();
    }
};
