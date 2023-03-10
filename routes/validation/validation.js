const Joi = require('joi');

const addPostValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required().trim(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .trim(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .trim(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: error.details[0].message });
  }
  next();
};

const updataPostValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).trim(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .trim(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .trim(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: error.details[0].message });
  }
  next();
};

module.exports = {
  addPostValidation,
  updataPostValidation,
};
