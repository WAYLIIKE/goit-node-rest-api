import Joi from 'joi';
import { validateBody } from '../helpers/validateBody.js';

export const createContactSchema = validateBody(data =>
  Joi.object()
    .options({})
    .keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(4).max(30).required(),
    })
    .validate(data),
);

export const updateContactSchema = validateBody(data =>
  Joi.object()
    .options({})
    .or('name', 'email', 'phone')
    .keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
      phone: Joi.string().min(4).max(30),
    })
    .validate(data),
);
