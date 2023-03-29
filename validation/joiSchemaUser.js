const Joi = require('joi');
const { errValidationUserData } = require('../constants/customErrorMessage');
const AppError = require('../utils/appError');

const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,100})/;

const joiSchemaUser = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .email({
        tlds: { allow: ['com', 'net', 'uk', 'org', 'ca'] },
      })
      .required()
      .trim()
      .error(() => new AppError(400, errValidationUserData)),
    password: Joi.string()
      .regex(PASSWD_REGEX)
      .required()
      .trim()
      .error(() => new AppError(400, errValidationUserData)),
  });

module.exports = joiSchemaUser;
