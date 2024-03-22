const express = require('express');

const router = express.Router();

const booksCtrl = require('../controllers/books');

router.post('/', booksCtrl.createThing);
router.get('/:id', booksCtrl.getOneThing); 
router.get('/', booksCtrl.getAllThings);
router.put('/:id',booksCtrl.modifyThing);
router.delete('/:id', booksCtrl.deleteThing);
  

module.exports = router;