const Joi = require('joi');
const USER_ROLES_ENUM = require('../constants/enums');
const AppError = require('../utils/appError');
const { errValidationUserData } = require('../constants/customErrorMessage');

const joiSchemaUser = Joi.object()
  .options({ abortEarly: false })
  .keys({
    subscription: Joi.string()
      .valid(...Object.values(USER_ROLES_ENUM))
      .required()
      .error(() => new AppError(400, errValidationUserData)),
  });

module.exports = joiSchemaUser;
