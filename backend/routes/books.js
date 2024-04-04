const express = require('express');
const multer = require('../middleware/multer-config');
const router = express.Router();

const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');



router.post('/', auth, multer, booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook); 
router.get('/', booksCtrl.getAllBooks);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.addRating);

module.exports = router;