const Joi = require('joi');

const JoiSchemaValidationPatchRequest = Joi.object().keys({
  favorite: Joi.boolean().required(),
});

module.exports = JoiSchemaValidationPatchRequest;
