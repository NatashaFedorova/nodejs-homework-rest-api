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

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) return next(new AppError(401, tokenError));

  req.user = currentUser;

  next();
});

module.exports = checkToken;
