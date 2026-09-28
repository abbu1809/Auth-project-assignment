import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  getRefreshController,
  getMeController,
  logoutController,
} from '../controllers/auth.controller.js';
import {
  registerUserValidator,
  loginUserValidator,
} from '../validators/auth.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = Router();

/*
//* @route   POST /api/auth/register
*/

router.post('/register', registerUserValidator, registerUserController);

/*
//* @route   POST /api/auth/login
*/

router.post('/login', loginUserValidator, loginUserController);

/*
//* @route   POST /api/auth/refresh
*/

router.post('/refresh', getRefreshController);

/*
//* @route   get /api/auth/me
*/

router.get('/me', authenticate, getMeController);

router.get('/logout', authenticate, logoutController);

export default router;
