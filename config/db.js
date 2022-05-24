import mongoose from 'mongoose';
//mongoose será nuestro conector para mongodb , tiene las funciones suficiente para hacer todo lo que necesitas en mongo.

/**
 * ConnectDB() es una función asíncrona que usa mongoose para conectarse a la base de datos y, si
 * falla, registrará el error y saldrá del proceso.
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MONGODB conectado en: ${url}`);
  } catch (error) {
    console.log(error);
    process.exit(1); //forzamos a finalizar los procesos, detenemos el servidor
  }
};

export default connectDB;
