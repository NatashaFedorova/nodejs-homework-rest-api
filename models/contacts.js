const fs = require('fs/promises');

const listContacts = async () => {
  try {
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'));
    return contacts;
  } catch (err) {
    return err.message;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'));
    const contactById = contacts.find(({ id }) => id === contactId);
    return contactById;
  } catch (err) {
     return err.message;
  }
};

const addContact = async (body) => {
  try {
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'));
    const newListContacts = [...contacts, body];
    fs.writeFile('./models/contacts.json', JSON.stringify(newListContacts));
  } catch (err) {
     return err.message;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'));
    const contactById = contacts.find(({ id }) => id === contactId);

    if (!contactById) return contactById;

    const newContacts = contacts.filter(({ id }) => id !== contactId);
    fs.writeFile('./models/contacts.json', JSON.stringify(newContacts));
    return contactById;
  } catch (err) {
    return err.message;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;

    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'));

    const contactById = contacts.find(({ id }) => id === contactId);
    if (name) contactById.name = name;
    if (email) contactById.email = email;
    if (phone) contactById.phone = phone;

    const contactIdx = contacts.findIndex(({ id }) => id === contactId);
    contacts[contactIdx] = contactById;

    fs.writeFile('./models/contacts.json', JSON.stringify(contacts));
    return contactById;
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
