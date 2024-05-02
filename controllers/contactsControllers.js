import { HttpError } from '../helpers/HttpError.js';
import { validateBody } from '../helpers/validateBody.js';
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

    if (!contact) throw new HttpError(404);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await removeContact(id);

    if (!contact) throw new HttpError(404);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { value, error } = validateBody(createContactSchema, req.body);

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
    const { value, error } = validateBody(updateContactSchema, req.body);

    if (error) throw new HttpError(400, error);

    const { id } = req.params;

    const { name, email, phone } = value;

    const contact = await updateContact(id, { name, email, phone });

    if (!contact) throw new HttpError(404);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
