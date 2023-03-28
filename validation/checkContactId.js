const {
  Types: { ObjectId },
} = require('mongoose');
const Contact = require('../models/contact');
const AppError = require('../utils/appError');
const asyncWrapper = require('../utils/asyncWrapper');
const {
  errorFindingUser,
  validationUserIdError,
} = require('../constants/customErrorMessage');

const checkContactId = asyncWrapper(async (req, res, next) => {
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId))
    return next(new AppError(400, validationUserIdError));

  const contactExists = await Contact.exists({ _id: contactId });

  if (!contactExists) return next(new AppError(404, errorFindingUser));

  next();
});
module.exports = checkContactId;
