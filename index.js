// index.js, tenemos la configuracion de nuestro servidor

// importramos express, para usar import tenemos que poner en el package.json "type: modules"
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.use(express.json()); //procesa la info de tipo json

//instalamos npm i dotenv y lo importamos. Es para ocultar los datos de conexion con mongodb
dotenv.config();

// una vez que se hace el deployment, es importante tener una variable de entorno para el puerto

/* Conexión a la base de datos. */
connectDB();

//Configuracion de cors
const whiteList = [process.env.FRONTEND_URL]; //DOMINIOS PERMITIDOS PARA CONECTARSE A LA DB

/* Una función que comprueba si el origen está en la lista blanca. Si es así, permite que la solicitud
se realice. Si no es así, arroja un error. */
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //origin identifica que url envia la peticion
      //puede consultar la API
      callback(null, true);
    } else {
      //No puede consultar la API
      callback(new Error('Error de cors'));
    }
  },
};

app.use(cors(corsOptions));

//ROUTING

/* Diciéndole al servidor que use las rutas en el archivo userRoutes.js. */
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;
//escuchamos por el puerto 4000
app.listen(PORT, () => {
  console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}`);
});
