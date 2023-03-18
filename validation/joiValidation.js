const Joi = require('joi');

const joiValidation = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().min(3).max(30).required().trim(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net', 'uk', 'org', 'ca'] },
        })
        .required()
        .trim(),
      phone: Joi.string().required().trim(),
      favorite: Joi.boolean(),
    })
    .validate(data);

module.exports = joiValidation;
