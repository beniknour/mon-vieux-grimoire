const express = require('express');
const multer = require('../middleware/multer-config');
const router = express.Router();

const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');
const sharp = require('../middleware/sharp');

router.get('/bestrating', booksCtrl.bestRating);
router.get('/:id', booksCtrl.getOneBook); 
router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer, sharp, booksCtrl.createBook);
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);
router.post('/:id/rating', auth, booksCtrl.addRating);
router.delete('/:id', auth, booksCtrl.deleteBook);


module.exports = router;