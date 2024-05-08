import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import Jimp from 'jimp';

import { HttpError } from '../helpers/HttpError.js';
import { validateBody } from '../helpers/validateBody.js';
import { User } from '../models/userModel.js';
import { authUserSchema, emailSchema } from '../schemas/usersSchemas.js';
import { getAvatarLink, getHashPassword } from '../services/usersServices.js';
import { nanoid } from 'nanoid';
import { sendEmail } from '../helpers/sendEmail.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.status(409).json({
        message: 'Email in use',
      });
    }

    const { value, error } = validateBody(authUserSchema, req.body);

    if (error) throw new HttpError(400, error);

    const passwordHashed = await getHashPassword(value.password);

    value.password = passwordHashed;

    const avatar = getAvatarLink(value.email);

    const verificationToken = nanoid();

    const user = await User.create({
      ...value,
      avatarURL: avatar,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: 'Verify email',
      html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

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
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user.verify) throw new HttpError(401, 'Email not verified');

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

export const updateAvatarUser = async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400);

    Jimp.read(req.file.path, (err, img) => {
      if (err) throw err;
      img
        .resize(100, 100) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(path.join('public', 'avatars', req.file.filename)); // save
    });

    const { email } = req.user;

    await User.findOneAndUpdate(
      { email },
      { avatarURL: `avatars/${req.file.filename}` },
    );

    res.status(200).json({ avatarURL: `avatars/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, 'User not found');
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: 'Verification successful',
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { error } = validateBody(emailSchema, req.body);

    if (error) throw new HttpError(400, error);

    const user = await User.findOne({ email });

    if (user.verify)
      throw new HttpError(400, 'Verification has already been passed');

    const verifyEmail = {
      to: email,
      subject: 'Verify email',
      html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
      message: 'Verification email sent',
    });
  } catch (error) {
    next(error);
  }
};
