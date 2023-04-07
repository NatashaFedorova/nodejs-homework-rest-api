const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { STARTER } = require('../constants/enums');
const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/user');
const AppError = require('../utils/appError');
const {
  errorLogin,
  errorChangeAvatar,
} = require('../constants/customErrorMessage');
const path = require('path');

require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRES } = process.env;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const register = asyncWrapper(async (req, res) => {
  const newUser = await User.create({
    ...req.body,
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

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError(401, errorLogin));

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

  await Jimp.read(tempUpload).then((img) =>
    img.resize(250, 250).write(tempUpload)
  );

  const newPath = path.join('public', 'avatars', filename);
  await fs.rename(tempUpload, newPath);

  user.avatarURL = newPath;
  console.log(newPath);
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
};
