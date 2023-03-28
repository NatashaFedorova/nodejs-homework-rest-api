const validateBody = require('./validateBody');
const joiSchemaUser = require('./joiSchemaUser');
const checkContactId = require('./checkContactId');
const JoiSchemaForCreatingContact = require('./joiSchemaForCreatingContact');
const JoiSchemaValidationPatchRequest = require('./joiSchemaValidationPatchRequest');

module.exports = {
  validateBody,
  joiSchemaUser,
  checkContactId,
  JoiSchemaForCreatingContact,
  JoiSchemaValidationPatchRequest,
};
