const express = require('express');
const router = express.Router();
const userController = require('../Controllers/User')

router.post('/sign-up', userController.signUp)
router.post('/login', userController.login)

module.exports = router;