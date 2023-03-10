const express = require('express');

const { uuid } = require('uuidv4');

const router = express.Router();

const {
  addPostValidation,
  updataPostValidation,
} = require('../validation/validation');

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts });
  } catch (err) {
    next(err);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await getContactById(contactId);
    if (!contactById) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ contact: contactById });
  } catch (err) {
    next(err);
  }
});

router.post('/', addPostValidation, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = { id: uuid(), name, email, phone };
    await addContact(newContact);
    res.status(201).json({ newContact });
  } catch (err) {
    next(err);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactDeleted = await removeContact(contactId);
    if (!contactDeleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'contact deleted' });
  } catch (err) {
    next(err);
  }
});

router.put('/:contactId', updataPostValidation, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updetedContact = await updateContact(contactId, req.body);
    if (!updetedContact) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ contact: updetedContact });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
