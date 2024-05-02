import express from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  changeContact,
} from '../controllers/contactsControllers.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', createContact);

contactsRouter.put('/:id', changeContact);

export { contactsRouter };
