import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
//EL MODELO ES EL QUE INTERACTURA DIRECTAMENTE CON LA BASE DE DATOS
// Cada colección que tengamos en nuestro mongo debemos crear un modelo, esto ayuda para que siempre tengamos la misma estructura en todo nuestro código

const userSchema = mongoose.Schema(
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

//HASHEAMOS LA PASSWORD
//USAMOS FUNCTION EN VES DE ARROW FUNCTION POR EL THIS
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //COMPROBAMOS QUE LA CONTRASEÑA NO HAYA SIDO MODIFICADA
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); //USAMOS THIS PORQUE HACEMOS REFERENCIA AL OBJETO USUARIO
});

//CHEQUEAMOS LA CONTRASEÑA QUE PONE EL USUARIO EN EL FORM CON LA QUE ESTA EN LA BASE DE DATOS
userSchema.methods.checkPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
