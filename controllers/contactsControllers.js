const asyncWrapper = require('../utils/asyncWrapper');
const Contact = require('../models/useModel');

const getContacts = asyncWrapper(async (req, res) => {
  const contacts = await Contact.find().sort({ name: 1 }).lean();
  res.status(200).json({ contacts });
});

const getContactById = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);
  res.status(200).json({ contact: contactById });
});

const addContact = asyncWrapper(async (req, res) => {
  const newContact = await await Contact.create(req.body);
  res.status(201).json({ newContact });
});

const deleteContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  await Contact.findByIdAndRemove(contactId);
  res.status(200).json({ message: 'contact deleted' });
});

const updateContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    req.body,
    { new: true }
  );
  res.status(200).json({ updatedContact });
});

const updateStatusContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  res.status(200).json({ updatedContact });
});

module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
