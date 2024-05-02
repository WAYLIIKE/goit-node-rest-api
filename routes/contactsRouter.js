import express from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  changeContact,
} from '../controllers/contactsControllers.js';
import { checkContactId } from '../middlewares/contactsMiddlewares.js';

const contactsRouter = express.Router();

contactsRouter.route('/').get(getAllContacts).post(createContact);

contactsRouter.use('/:id', checkContactId);
contactsRouter
  .route('/:id')
  .get(getOneContact)
  .delete(deleteContact)
  .put(changeContact);

export { contactsRouter };
