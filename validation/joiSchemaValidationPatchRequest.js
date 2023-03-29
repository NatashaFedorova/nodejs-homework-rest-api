const Joi = require('joi');

const JoiSchemaValidationPatchRequest = Joi.object()
  .options({ abortEarly: false })
  .keys({
    favorite: Joi.boolean().required(),
  });

module.exports = JoiSchemaValidationPatchRequest;
