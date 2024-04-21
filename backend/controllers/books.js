const Book = require('../models/Book');
const fs = require('fs'); // Interagit avec le système de fichiers
const path = require('path');
//requête POST
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);//extrait les données du livre
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split(".")[0]}.webp`,
      averageRating: bookObject.ratings[0].grade
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};


//requêtes PUT

exports.modifyBook = (req, res, next) => {
  const bookId = req.params.id;
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split(".")[0]}.webp`
  } : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Vérifie si l'utilisateur peut modifier
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // Mise à jour 
      Book.updateOne({ _id: bookId }, { ...bookObject })
        .then(() => {
          const oldFilename = book.imageUrl.split("/images/")[1];
          // Supprime l'ancienne image du système de fichiers si une nouvelle image a été téléchargée
          if (req.file) {
            console.log(req.file);
            
            fs.unlink(`images/${oldFilename}`, (error) => {
              if (error) {
                console.log(error);
              }
            });
          }
          res.status(200).json({ message: "Objet modifié!" });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// requête DELETE
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

//requêtes GET

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
};
exports.getAllBooks = (req, res, next) => {
    Book.find() //find() renvoye un tableau contenant tous les Books dans notre base de données
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};


// RATINGS


/*POST*/

exports.addRating = (req, res, next) => {
    const { userId, rating } = req.body;
    const bookId = req.params.id;
    const user = req.body.userId;

    // Vérifie si l'utilisateur actuel est autorisé à ajouter une note
    if (user !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
    }
    // Vérifie si la note est valide
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
    }
    
    // Recherche le livre correspondant dans la base de données
    Book.findById(bookId)
        .then(book => {
            // Vérifie si le livre existe
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            // Récupère les notes existantes pour ce livre
            const bookRatings = book.ratings; 

            // Vérifie si l'utilisateur a déjà noté ce livre
            const userRating = bookRatings.find(rating => rating.userId === userId);
            if (userRating) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
            }

            // Ajout de la nouvelle notation à la liste
            const newRating = { userId, grade: rating };
            bookRatings.push(newRating);

            // Recalcule la note moyenne
            const totalRatings = bookRatings.length;
            const noteRating = bookRatings.reduce((sum, rating) => sum + rating.grade, 0);
            const averageRatings = Math.floor((noteRating / totalRatings) * 10) / 10;

            // Mise à jour de la note moyenne dans le livre
            book.averageRating = averageRatings;
            
            // Sauvegarde

            book.save()
                .then(updatedBook => {
                    res.status(200).json(updatedBook);
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

/*GET*/
exports.bestRating = (req, res, next) => {
    Book.find()
      .sort({ averageRating: -1 }) // Trie par note moyenne décroissante
      .limit(3) // Limite les résultats aux 3 premiers livres
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(400).json({ error }));
};
