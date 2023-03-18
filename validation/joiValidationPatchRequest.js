const Joi = require('joi');

const joiValidationPatchRequest = (data) =>
  Joi.object()
    .keys({
      favorite: Joi.boolean().required(),
    })
    .validate(data);

module.exports = joiValidationPatchRequest;
