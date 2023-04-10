const Joi = require('joi');
const AppError = require('../utils/appError');
const {
  errValidationEmailResendVerifyEmail,
} = require('../constants/customErrorMessage');

const joiSchemaEmailResendVerifyEmail = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .email({
        tlds: { allow: ['com', 'net', 'uk', 'org', 'ca'] },
      })
      .required()
      .trim()
      .error(() => new AppError(400, errValidationEmailResendVerifyEmail)),
  });

module.exports = joiSchemaEmailResendVerifyEmail;
