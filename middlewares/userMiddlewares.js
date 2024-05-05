import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';

import { HttpError } from '../helpers/HttpError.js';
import { User } from '../models/userModel.js';
import { v4 } from 'uuid';

export const checkAuthToken = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer')
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    const {
      payload: { id },
    } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) throw new HttpError(401);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('tmp'));
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];

    cb(null, `${req.user.id}-${v4()}.${extension}`);
  },
  limits: {
    fileSize: 1048576,
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new HttpError(400, 'Please, upload images only..'), false);
  }
};

export const uploadAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single('avatar');
