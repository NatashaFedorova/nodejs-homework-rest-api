const Contact = require('../models/contact');
const {
  defaultLimit,
  maxLimit,
  defaultPage,
} = require('../constants/valueReqQuery');
const asyncWrapper = require('../utils/asyncWrapper');

const getContacts = asyncWrapper(async (req, res) => {
  const { limit, page, favorite } = req.query;

  const paginationLimit =
    (+limit > maxLimit ? maxLimit : +limit) || defaultLimit;
  const paginationPage = +page || defaultPage;
  const paginationSkip = (paginationPage - 1) * paginationLimit;
  const searchByFieldFavorite = favorite ? { favorite: true } : {};

  const contacts = await Contact.find(searchByFieldFavorite)
    .sort({ name: 1 })
    .limit(paginationLimit)
    .skip(paginationSkip)
    .lean();
  res
    .status(200)
    .json({ limit: paginationLimit, page: paginationPage, contacts });
});

const getFavoriteContacts = asyncWrapper(async (req, res) => {
  const favoriteContacts = await Contact.find({ favorite: true });
  res.status(200).json({ favoriteContacts });
});

const getContactById = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);
  res.status(200).json({ contact: contactById });
});

const addContact = asyncWrapper(async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({ newContact });
});

const deleteContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  await Contact.findByIdAndRemove(contactId);
  res.status(200).json({ message: 'contact deleted' });
});

const updateContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
  getFavoriteContacts,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
