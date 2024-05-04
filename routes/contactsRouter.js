import express from 'express';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  changeContact,
  updateFavorite,
} from '../controllers/contactsControllers.js';

import { checkContactId } from '../middlewares/contactMiddlewares.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.post('/', createContact);

contactsRouter.use('/:id', checkContactId);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.put('/:id', changeContact);

contactsRouter.patch('/:id/favorite', updateFavorite);

export { contactsRouter };
