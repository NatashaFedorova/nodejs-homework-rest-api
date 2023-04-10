const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');
const User = require('../models/user');
const { tokenError } = require('../constants/customErrorMessage');

require('dotenv').config();
const { JWT_SECRET } = process.env;

const checkToken = asyncWrapper(async (req, res, next) => {
  const token =
    (await req.headers.authorization?.startsWith('Bearer')) &&
    req.headers.authorization.split(' ')[1];
  if (!token) return next(new AppError(401, tokenError));

  const decodedToken = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError(401, tokenError));
    }
    return decoded;
  });

  const findedUser = await User.findById(decodedToken.id, '-password');
  if (!findedUser) return next(new AppError(401, tokenError));

  if (token && !findedUser.verify) return next(new AppError(401, tokenError));
  if (token !== findedUser.token) return next(new AppError(401, tokenError));

  req.user = findedUser;

  next();
});

module.exports = checkToken;
