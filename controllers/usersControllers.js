import bcrypt from 'bcrypt';

import { HttpError } from '../helpers/HttpError.js';
import { validateBody } from '../helpers/validateBody.js';
import { User } from '../models/userModel.js';
import { authUserSchema } from '../schemas/usersSchemas.js';
import { getHashPassword } from '../services/usersServices.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  const { email } = req.body;

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res.status(409).json({
      message: 'Email in use',
    });
  }

  try {
    const { value, error } = validateBody(authUserSchema, req.body);

    if (error) throw new HttpError(400, error);

    const passwordHashed = await getHashPassword(value.password);

    value.password = passwordHashed;

    const user = await User.create(value);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Email or password is wrong',
      });
    }

    const { value, error } = validateBody(authUserSchema, req.body);

    if (error) throw new HttpError(400, error);

    const passwordUnhashed = await bcrypt.compare(
      value.password,
      user.password,
    );

    if (!passwordUnhashed) {
      return res.status(401).json({
        message: 'Email or password is wrong',
      });
    }

    const payload = {
      id: user.id,
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    await User.findOneAndUpdate({ email }, { token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { email } = req.user;

    await User.findOneAndUpdate({ email }, { token: null });

    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const { user } = req;

    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};
