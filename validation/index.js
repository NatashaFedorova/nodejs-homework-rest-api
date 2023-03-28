const validateBody = require('./validateBody');
const joiSchemaUser = require('./joiSchemaUser');
const joiSchemaPatchUser = require('./joiSchemaPatchUser');
const checkContactId = require('./checkContactId');
const JoiSchemaForCreatingContact = require('./joiSchemaForCreatingContact');
const JoiSchemaValidationPatchRequest = require('./joiSchemaValidationPatchRequest');

module.exports = {
  validateBody,
  joiSchemaUser,
  joiSchemaPatchUser,
  checkContactId,
  JoiSchemaForCreatingContact,
  JoiSchemaValidationPatchRequest,
};
