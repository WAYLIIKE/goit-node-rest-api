import {
  addContact,
  listContacts,
  removeContact,
  updateContact,
} from '../services/contactsServices.js';

export const createContact = async (req, res, next) => {
  try {
    const contact = await addContact(req.contact);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { contact } = req;

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contact } = req;

    await removeContact(contact.id);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const changeContact = async (req, res, next) => {
  try {
    const { newContact, id } = req;

    const contact = await updateContact(id, newContact);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { statusData, id } = req;

    const contact = await updateContact(id, statusData);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
