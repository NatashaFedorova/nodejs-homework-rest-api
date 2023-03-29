const Joi = require('joi');

const JoiSchemaForCreatingContact = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().min(3).max(30).required().trim(),
    email: Joi.string()
      .email({
        tlds: { allow: ['com', 'net', 'uk', 'org', 'ca'] },
      })
      .required()
      .trim(),
    phone: Joi.string().min(13).required().trim(),
    favorite: Joi.boolean(),
  });

module.exports = JoiSchemaForCreatingContact;
