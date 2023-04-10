const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const { STARTER } = require('../constants/enums');
const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/user');
const AppError = require('../utils/appError');
const {
  errorLogin,
  errorChangeAvatar,
  errVerification,
  errResendVerifyEmail,
  errFindUserByEmail,
  errFindUserByVerificationToker,
} = require('../constants/customErrorMessage');
const path = require('path');
const sendEmail = require('../middleware/sendEmail');

require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRES, BASE_URL } = process.env;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const register = asyncWrapper(async (req, res) => {
  const verificationToken = uuidv4();
  const verifyEmail = {
    to: req.body.email,
    subject: 'Verification email',
    html: `<p>Please, follow the link to verify your email</p><a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Verify my email</a>`,
  };
  await sendEmail(verifyEmail);

  const newUser = await User.create({
    ...req.body,
    verify: false,
    verificationToken,
    subscription: STARTER,
  });

  const token = await signToken(newUser.id);
  await User.findByIdAndUpdate(newUser.id, { token });

  const { email, subscription } = newUser;
  newUser.password = undefined;

  res.status(201).json({
    token,
    user: { email, subscription },
  });
});

const verifyEmail = asyncWrapper(async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) return next(new AppError(401, errFindUserByVerificationToker));

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({ message: 'Verification successful' });
});

const resendVerifyEmail = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError(401, errFindUserByEmail));

  if (user.verify) return next(new AppError(400, errResendVerifyEmail));

  const verifyEmail = {
    to: req.body.email,
    subject: 'Verification email',
    html: `<p>Please, follow the link to verify your email</p><a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Verify my email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: 'Verification email sent' });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError(401, errorLogin));

  if (!user.verify) return next(new AppError(401, errVerification));

  const passwordMatched = await user.checkPassword(password, user.password);
  if (!passwordMatched) return next(new AppError(401, errorLogin));

  const token = await signToken(user.id);
  await User.findByIdAndUpdate(user.id, { token });

  const { subscription } = user;
  user.password = undefined;

  res.status(200).json({
    token,
    user: { email, subscription },
  });
});

const getCurrentUser = asyncWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
});

const logout = asyncWrapper(async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).json({ msg: 'No Content' });
});

const changeSubscription = asyncWrapper(async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );
  res.status(200).json({ user: updatedUser });
});

const userAvatarChange = asyncWrapper(async (req, res, next) => {
  const { user, file } = req;
  const { path: tempUpload, filename } = file;
  const newPath = path.join(`public/avatars/${filename}`);

  await Jimp.read(tempUpload).then((img) =>
    img.resize(250, 250).write(tempUpload)
  );

  await fs.rename(tempUpload, newPath);

  user.avatarURL = newPath;
  await user.save();

  if (user.avatarURL !== newPath) {
    await fs.unlink(tempUpload, (err) => next(err));
    await fs.unlink(newPath, (err) => next(err));
    return next(new AppError(500, errorChangeAvatar));
  }

  res.status(200).json({
    avatarURL: user.avatarURL,
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  changeSubscription,
  userAvatarChange,
  verifyEmail,
  resendVerifyEmail,
};
