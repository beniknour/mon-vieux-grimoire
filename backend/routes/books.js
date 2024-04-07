const express = require('express');
const multer = require('../middleware/multer-config');
const router = express.Router();

const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');
const sharp = require('../middleware/sharp');
const typeFile = require('../middleware/type-file');

router.get('/bestrating', booksCtrl.bestRating);
router.get('/:id', booksCtrl.getOneBook); 
router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer, typeFile, sharp, booksCtrl.createBook);
router.put('/:id', auth, multer, typeFile, sharp, booksCtrl.modifyBook);
router.post('/:id/rating', auth, booksCtrl.addRating);
router.delete('/:id', auth, booksCtrl.deleteBook);


module.exports = router;