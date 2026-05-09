/**
 * @file src/routes/auth.routes.js
 * @description Rutas de autenticación (públicas + protegidas).
 */

import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { auth, validate } from '../middlewares/index.js';
import { loginSchema, registerSchema } from '../schemas/index.js';

const router = Router();

// ─── Públicas ────────────────────────────────────────────────────
router.post('/login',    validate(loginSchema, 'body'),    authController.login);
router.post('/register', validate(registerSchema, 'body'), authController.register);

// ─── Protegidas ──────────────────────────────────────────────────
router.post('/logout', auth, authController.logout);
router.get('/me',      auth, authController.me);
router.get('/verify',  auth, authController.verifyToken);
router.get('/renew',   auth, authController.renew);

export default router;