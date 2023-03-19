const {
  Types: { ObjectId },
} = require('mongoose');
const Contact = require('../models/Contact');
const AppError = require('../utils/appError');
const asyncWrapper = require('../utils/asyncWrapper');

const checkContactId = asyncWrapper(async (req, res, next) => {
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId))
    return next(new AppError(400, 'Invalid user id...'));

  const contactExists = await Contact.exists({ _id: contactId });

  if (!contactExists)
    return next(new AppError(404, `Contact not found`));

  next();
});
module.exports = checkContactId;
