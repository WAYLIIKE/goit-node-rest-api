import { HttpError } from '../helpers/HttpError.js';
import { listContacts } from '../services/contactsServices.js';

export const checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contacts = await listContacts();

    const contact = contacts.find(item => item.id === id);

    if (!contact) {
      throw new HttpError(404);
    }

    req.contact = contact;

    next();
  } catch (error) {
    next(error);
  }
};
