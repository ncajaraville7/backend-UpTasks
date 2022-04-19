import express from 'express';

const router = express.Router();

import { register } from '../controllers/usuarioController.js';

//CREACION REGISTRO Y CONFIRMACION DE USUARIOS
router.post('/', register); //CREA UN NUEVO USUARIO

export default router;
