import Joi from 'joi';

const errorMessages = {
  missingField: 'Body must have at least one field',
};

export const createContactSchema = Joi.object()
  .options({})
  .keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(4).max(30).required(),
    favorite: Joi.boolean(),
  });

export const updateContactSchema = Joi.object()
  .options({})
  .or('name', 'email', 'phone', 'favorite')
  .keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    phone: Joi.string().min(4).max(30),
    favorite: Joi.boolean(),
  })
  .messages({
    'object.missing': errorMessages.missingField,
  });

export const updateStatusContactSchema = Joi.object().options({}).keys({
  favorite: Joi.boolean().required(),
});
