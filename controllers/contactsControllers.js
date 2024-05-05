import { HttpError } from '../helpers/HttpError.js';
import { validateBody } from '../helpers/validateBody.js';

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from '../schemas/contactsSchemas.js';

import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from '../services/contactsServices.js';

export const createContact = async (req, res, next) => {
  try {
    const { value, error } = validateBody(createContactSchema, req.body);

    if (error) throw new HttpError(400, error);

    const { name, email, phone, favorite } = value;

    const newContact = {
      name,
      email,
      phone,
      favorite,
      owner: req.user._id,
    };

    const contact = await addContact(newContact);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const contacts = await listContacts(owner);

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;

    const contact = await getContactById(id, owner);

    if (!contact) throw new HttpError(404);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;

    const contact = await removeContact(id, owner);

    if (!contact) throw new HttpError(404);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const changeContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { value, error } = validateBody(updateContactSchema, req.body);

    if (error) throw new HttpError(400, error);

    const contact = await updateContact(req.params.id, value, owner);

    if (!contact) throw new HttpError(404);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { value, error } = validateBody(updateStatusContactSchema, req.body);

    if (error) throw new HttpError(400, error);

    const contact = await updateContact(req.params.id, value, owner);

    if (!contact) throw new HttpError(404);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
