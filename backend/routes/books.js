const express = require('express');
const auth = require('auth');

const router = express.Router();

const booksCtrl = require('../controllers/books');



router.post('/', auth, booksCtrl.createThing);
router.get('/:id', auth, booksCtrl.getOneThing); 
router.get('/', auth, booksCtrl.getAllThings);
router.put('/:id', auth,booksCtrl.modifyThing);
router.delete('/:id', auth, booksCtrl.deleteThing);
  

module.exports = router;