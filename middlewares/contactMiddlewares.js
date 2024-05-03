import { Types } from 'mongoose';

import { HttpError } from '../helpers/HttpError.js';

import { getContactById } from '../services/contactsServices.js';

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from '../schemas/contactsSchemas.js';

import { validateBody } from '../helpers/validateBody.js';
import { Contact } from '../models/contactModel.js';

export const checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) throw new HttpError(404);

    const contact = await getContactById(id);
    if (!contact) throw new HttpError(404);

    req.contact = contact;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkContactCreate = async (req, res, next) => {
  try {
    const { value, error } = validateBody(createContactSchema, req.body);

    if (error) throw new HttpError(400, error);

    const isUniquePhone = await Contact.exists({ phone: value.phone });

    if (!!isUniquePhone) throw new HttpError(400);

    const { name, email, phone, favorite } = value;

    const newContact = {
      name,
      email,
      phone,
      favorite,
    };

    req.contact = newContact;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkContactUpdate = async (req, res, next) => {
  try {
    const { value, error } = validateBody(updateContactSchema, req.body);

    if (error) throw new HttpError(400, error);

    req.newContact = value;

    req.id = req.params.id;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkStatusContact = async (req, res, next) => {
  try {
    const { value, error } = validateBody(updateStatusContactSchema, req.body);

    if (error) throw new HttpError(400, error);

    req.statusData = value;

    req.id = req.params.id;

    next();
  } catch (error) {
    next(error);
  }
};
