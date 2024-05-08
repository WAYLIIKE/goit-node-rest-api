import express from 'express';

import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerifyEmail,
  updateAvatarUser,
  verifyEmail,
} from '../controllers/usersControllers.js';
import {
  checkAuthToken,
  uploadAvatar,
} from '../middlewares/userMiddlewares.js';

const usersRouter = express.Router();

/**
 * @openapi
 * /register:
 *  post:
 *     tags:
 *     - register
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */

usersRouter.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *  post:
 *     tags:
 *     - login
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */

usersRouter.post('/login', loginUser);

usersRouter.post('/logout', checkAuthToken, logoutUser);

usersRouter.post('/current', checkAuthToken, currentUser);

usersRouter.patch('/avatars', checkAuthToken, uploadAvatar, updateAvatarUser);

usersRouter.get('/verify/:verificationToken', verifyEmail);

usersRouter.post('/verify', resendVerifyEmail);

export { usersRouter };
