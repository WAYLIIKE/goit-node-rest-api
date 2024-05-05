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
import { checkAuthToken } from '../middlewares/userMiddlewares.js';

const contactsRouter = express.Router();

contactsRouter.get('/', checkAuthToken, getAllContacts);

contactsRouter.post('/', checkAuthToken, createContact);

contactsRouter.use('/:id', checkAuthToken, checkContactId);

contactsRouter.get('/:id', checkAuthToken, getOneContact);

contactsRouter.delete('/:id', checkAuthToken, deleteContact);

contactsRouter.put('/:id', checkAuthToken, changeContact);

contactsRouter.patch('/:id/favorite', checkAuthToken, updateFavorite);

export { contactsRouter };
