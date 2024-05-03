import express from 'express';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  changeContact,
  updateFavorite,
} from '../controllers/contactsControllers.js';

import {
  checkContactCreate,
  checkContactId,
  checkContactUpdate,
  checkStatusContact,
} from '../middlewares/contactMiddlewares.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.post('/', checkContactCreate, createContact);

contactsRouter.use('/:id', checkContactId);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.put('/:id', checkContactUpdate, changeContact);

contactsRouter.patch('/:id/favorite', checkStatusContact, updateFavorite);

export { contactsRouter };
