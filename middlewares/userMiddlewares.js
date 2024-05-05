import passport from 'passport';
import { HttpError } from '../helpers/HttpError.js';
import { User } from '../models/userModel.js';

import jwt from 'jsonwebtoken';

export const checkAuthToken = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    throw new HttpError(401);
  }

  try {
    const {
      payload: { id },
    } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      throw new HttpError(401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
