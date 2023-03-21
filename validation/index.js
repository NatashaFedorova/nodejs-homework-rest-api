const validateBody = require('./validateBody');
const checkContactId = require('./checkContactId');
const JoiSchemaForCreatingContact = require('./joiSchemaForCreatingContact');
const JoiSchemaValidationPatchRequest = require('./joiSchemaValidationPatchRequest');

module.exports = {
  validateBody,
  checkContactId,
  JoiSchemaForCreatingContact,
  JoiSchemaValidationPatchRequest,
};
