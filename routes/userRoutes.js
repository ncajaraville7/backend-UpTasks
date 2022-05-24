import express from 'express';

const router = express.Router();

import {
  register,
  authenticate,
  confirm,
  recoverPassword,
  checkToken,
  newPassword,
  profile,
} from '../controllers/userController.js';

import checkAuth from '../middleware/checkAuth.js';

//CREACION REGISTRO Y CONFIRMACION DE USUARIOS
/* Crear una ruta para cada una de las funciones en el archivo userController.js. */
router.post('/', register);
router.post('/login', authenticate);
router.get('/confirm/:token', confirm);
router.post('/recover-password', recoverPassword);
router.get('/recover-password/:token', checkToken);
router.post('/new-password/:token', newPassword);
router.get('/profile', checkAuth, profile);

export default router;
