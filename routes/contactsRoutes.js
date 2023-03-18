const express = require('express');
const router = express.Router();

const {
  checkContactId,
  checkContactData,
  checkDataUponPatchReq,
} = require('../validation');

const {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require('../controllers/contactsControllers');

router.route('/').post(checkContactData, addContact).get(getContacts);

router.use('/:contactId', checkContactId);

router
  .route('/:contactId')
  .get(getContactById)
  .put(checkContactData, updateContact)
  .delete(deleteContact);

router
  .route('/:contactId/favorite')
  .patch(checkDataUponPatchReq, updateStatusContact);

module.exports = router;
