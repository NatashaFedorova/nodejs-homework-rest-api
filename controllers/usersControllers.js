const jwt = require('jsonwebtoken');
const { STARTER } = require('../constants/enums');
const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/user');
const AppError = require('../utils/appError');
const { errorLogin } = require('../constants/customErrorMessage');

require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRES } = process.env;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const register = asyncWrapper(async (req, res, next) => {
  const newUser = await User.create({
    ...req.body,
    subscription: STARTER,
  });

  const { email, subscription } = newUser;

  newUser.password = undefined;
  const token = signToken(newUser.id);

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
  user.password = undefined;

  const token = signToken(user.id);
  const { subscription } = user;

  res.status(200).json({
    token,
    user: { email, subscription },
  });
});

const logout = asyncWrapper(async (req, res, next) => {
  res.json({ name: ' logout' });
});

module.exports = {
  register,
  login,
  logout,
};
