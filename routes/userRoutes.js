import express from 'express';

const router = express.Router();

import { register, authenticate } from '../controllers/userController.js';

//CREACION REGISTRO Y CONFIRMACION DE USUARIOS
router.post('/', register); //CREA UN NUEVO USUARIO
router.post('/login', authenticate);

export default router;
