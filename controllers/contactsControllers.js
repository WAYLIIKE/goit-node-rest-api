import { HttpError } from '../helpers/HttpError.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from '../services/contactsServices.js';

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
    const { id } = req.params;

    const contact = await getContactById(id);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await removeContact(id);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { value, error } = createContactSchema(req.body);

    if (error) throw new HttpError(400, error);

    const { name, email, phone } = value;

    const newContact = {
      name,
      email,
      phone,
    };

    const contact = await addContact(newContact);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const changeContact = async (req, res, next) => {
  try {
    const { value, error } = updateContactSchema(req.body);

    if (error) throw new HttpError(400, error);

    const { id } = req.params;

    const { name, email, phone } = value;

    // Validate count of params in body
    const oldContact = await getContactById(id);

    const newContact = {
      name: name ? name : oldContact.name,
      email: email ? email : oldContact.email,
      phone: phone ? phone : oldContact.phone,
    };

    const contact = await updateContact(id, newContact);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
