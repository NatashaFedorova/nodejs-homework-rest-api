const express = require('express');
const router = express.Router();

const {
  checkContactId,
  validateBody,
  JoiSchemaForCreatingContact,
  JoiSchemaValidationPatchRequest,
} = require('../validation');

const {
  getContacts,
  getContactById,
  getFavoriteContacts,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require('../controllers/contactsControllers');

router
  .route('/')
  .post(validateBody(JoiSchemaForCreatingContact), addContact)
  .get(getContacts);

router.route('/favorite').get(getFavoriteContacts);

router.use('/:contactId', checkContactId);

router
  .route('/:contactId')
  .get(getContactById)
  .put(validateBody(JoiSchemaForCreatingContact), updateContact)
  .delete(deleteContact);

router
  .route('/:contactId/favorite')
  .patch(
    validateBody(JoiSchemaValidationPatchRequest),
    updateStatusContact
  );

module.exports = router;
