import express from 'express';

import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/usersControllers.js';
import { checkAuthToken } from '../middlewares/userMiddlewares.js';

const usersRouter = express.Router();

usersRouter.post('/register', registerUser);

usersRouter.post('/login', loginUser);

usersRouter.post('/logout', checkAuthToken, logoutUser);

usersRouter.post('/current', checkAuthToken, currentUser);

export { usersRouter };
