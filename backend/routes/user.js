const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validateEmailFormat = require('../middleware/emailValidator');
router.post('/signup', validateEmailFormat, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;