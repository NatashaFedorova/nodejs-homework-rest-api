const express = require('express');
const Joi = require('joi');
const { uuid } = require('uuidv4');

const router = express.Router();

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
    res.status(500).json({ err: err.message });
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
    res.status(500).json({ err: err.message });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    if (!email) {
      return res.status(400).json({ message: 'missing required email field' });
    }
    if (!phone) {
      return res.status(400).json({ message: 'missing required phone field' });
    }
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
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ status: validationResult.error.details[0].message });
    }
    const newContact = { id: uuid(), name, email, phone };
    await addContact(newContact);
    res.status(201).json({ newContact });
  } catch (err) {
    res.status(500).json({ err: err.message });
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
    res.status(500).json({ err: err.message });
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const { contactId } = req.params;
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
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ status: validationResult.error.details[0].message });
    }
    const updetedContact = await updateContact(contactId, req.body);
    if (!updetedContact) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ contact: updetedContact });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
