// index.js, tenemos la configuracion de nuestro servidor

// importramos express, para usar import tenemos que poner en el package.json "type: modules"
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();
app.use(express.json()); //procesa la info de tipo json

//instalamos npm i dotenv y lo importamos. Es para ocultar los datos de conexion con mongodb
dotenv.config();

// una vez que se hace el deployment, es importante tener una variable de entorno para el puerto

/* Conexión a la base de datos. */
connectDB();

//ROUTING

/* Diciéndole al servidor que use las rutas en el archivo userRoutes.js. */
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 4000;
//escuchamos por el puerto 4000
app.listen(PORT, () => {
  console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}`);
});
