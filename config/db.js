import mongoose from 'mongoose';
//mongoose será nuestro conector para mongodb , tiene las funciones suficiente para hacer todo lo que necesitas en mongo.

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
    //forzamos a finalizar los procesos, detenemos el servidor
    process.exit(1);
  }
};

export default connectDB;
