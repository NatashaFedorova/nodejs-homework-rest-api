const express = require('express');
const router = express.Router();

const checkToken = require('../middleware/checkToken');
const uploadUserAvatar = require('../middleware/uploadUserAvatar');

const {
  validateBody,
  joiSchemaUser,
  joiSchemaPatchUser,
  joiSchemaEmailResendVerifyEmail,
} = require('../validation');

const {
  register,
  login,
  getCurrentUser,
  logout,
  changeSubscription,
  userAvatarChange,
  verifyEmail,
  resendVerifyEmail,
} = require('../controllers/usersControllers');

router.post('/register', validateBody(joiSchemaUser), register);
router.get('/verify/:verificationToken', verifyEmail);
router.post(
  '/verify',
  validateBody(joiSchemaEmailResendVerifyEmail),
  resendVerifyEmail
);
router.post('/login', validateBody(joiSchemaUser), login);
router.post('/logout', checkToken, logout);
router.get('/current', checkToken, getCurrentUser);
router.patch(
  '/',
  checkToken,
  validateBody(joiSchemaPatchUser),
  changeSubscription
);

router.patch('/avatars', checkToken, uploadUserAvatar, userAvatarChange);

module.exports = router;
