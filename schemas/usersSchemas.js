import Joi from 'joi';

export const authUserSchema = Joi.object()
  .options({})
  .keys({
    password: Joi.string().min(6).max(20).required(),
    email: Joi.string().email().required(),
  });
