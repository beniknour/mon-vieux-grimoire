const Book = require('../models/Book');
const fs = require('fs'); // Interagit avec le système de fichiers

//requête POST
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      averageRating: bookObject.ratings[0].grade
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};
//requêtes PUT

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
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


exports.addRating = (req, res, next) => {
    const { userId, rating } = req.body;
    const bookId = req.params.id;
    
    // Vérifie si la note est valide
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
    }
    
    // Recherche le livre correspondant dans la base de données
    Book.findById(bookId)
    
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
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
            const averageRating = noteRating / totalRatings;

            // Mise à jour la note moyenne dans le livre
            book.averageRating = averageRating;

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
