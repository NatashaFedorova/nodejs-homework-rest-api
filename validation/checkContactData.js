const asyncWrapper = require('../utils/asyncWrapper');
const Contact = require('../models/useModel');
const AppError = require('../utils/appError');
const joiValidation = require('./joiValidation');

const checkContactData = asyncWrapper(async (req, res, next) => {
  const { error, value } = await joiValidation(req.body);
  if (error) return next(new AppError(400, error.details[0].message));

  const { name, email, phone } = value;

  if (req.method === 'POST') {
    const contactWithThisNameExists = await Contact.exists({ name });
    if (contactWithThisNameExists)
      return next(new AppError(409, 'Contact with this name exists'));

    const contactWithThisEmailExists = await Contact.exists({
      email,
    });
    if (contactWithThisEmailExists)
      return next(
        new AppError(409, 'Contact with this email exists')
      );

    const contactWithThisPhoneExists = await Contact.exists({
      phone,
    });
    if (contactWithThisPhoneExists)
      return next(
        new AppError(409, 'Contact with this phone exists')
      );
  }

  req.body = value;
  next();
});
module.exports = checkContactData;
