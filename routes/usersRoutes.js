const express = require('express');
const router = express.Router();

const checkToken = require('../middleware/checkToken');
const {
  validateBody,
  joiSchemaUser,
  joiSchemaPatchUser,
} = require('../validation');
const {
  register,
  login,
  getCurrentUser,
  logout,
  changeSubscription,
} = require('../controllers/usersControllers');

router.post('/register', validateBody(joiSchemaUser), register);
router.post('/login', validateBody(joiSchemaUser), login);
router.post('/logout', checkToken, logout);
router.get('/current', checkToken, getCurrentUser);
router.patch(
  '/',
  checkToken,
  validateBody(joiSchemaPatchUser),
  changeSubscription
);

module.exports = router;
