import mongoose from 'mongoose';

// Cada colección que tengamos en nuestro mongo debemos crear un modelo, esto ayuda para que siempre tengamos la misma estructura en todo nuestro código

const userSchema = moongose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirm: {
      type: Boolean,
      default: false, // cuando se confirma la cuenta cambia a true
    },
  },
  {
    timestamps: true, // crea dos columnas mas, una de creado y otra de actualizado
  }
);

const User = moongose.model('User', userSchema);
export default User;
