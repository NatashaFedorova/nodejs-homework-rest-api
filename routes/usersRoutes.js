const express = require('express');
const router = express.Router();

const checkToken = require('../middleware/checkToken');
const { validateBody, joiSchemaUser } = require('../validation');
const { register, login, logout } = require('../controllers/usersControllers');

router.post('/register', validateBody(joiSchemaUser), register);
router.post('/login', validateBody(joiSchemaUser), login);
router.post('/logout', checkToken, logout);

module.exports = router;
