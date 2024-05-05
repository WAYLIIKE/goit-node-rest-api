import bcrypt from 'bcrypt';
import { HttpError } from '../helpers/HttpError.js';

export const getHashPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  } catch (error) {
    throw new HttpError(500, 'Internal Server Error.');
  }
};
