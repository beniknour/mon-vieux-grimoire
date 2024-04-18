const express = require('express');
const fileUpload = require('../middleware/multer-config');
const router = express.Router();

const authorization = require('../middleware/auth');
const booksCtrl = require('../controllers/books');
const modifyFile = require('../middleware/sharp');
const typeFile = require('../middleware/type-file');

router.get('/bestrating', booksCtrl.bestRating);
router.get('/:id', booksCtrl.getOneBook); 
router.get('/', booksCtrl.getAllBooks);
router.post('/:id/rating', authorization, booksCtrl.addRating);
router.post('/', authorization, fileUpload, typeFile, modifyFile, booksCtrl.createBook);
router.put('/:id', authorization, fileUpload, typeFile, modifyFile, booksCtrl.modifyBook);
router.delete('/:id', authorization, booksCtrl.deleteBook);


module.exports = router;