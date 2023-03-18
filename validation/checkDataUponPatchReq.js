const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');
const joiValidationPatchRequest = require('./joiValidationPatchRequest');

const checkDataUponPatchReq = asyncWrapper(async (req, res, next) => {
  const { error, value } = await joiValidationPatchRequest(req.body);

  if (error) return next(new AppError(400, error.details[0].message));

  req.body = value;
  next();
});

module.exports = checkDataUponPatchReq;
