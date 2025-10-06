const express = require('express');
const { register, login, getAllUsers, metaMaskLogin, metaMaskRegister } = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/metamask-login', metaMaskLogin);
router.post('/metamask-register', metaMaskRegister);
router.get('/', authenticate, authorizeAdmin, getAllUsers);

module.exports = router;