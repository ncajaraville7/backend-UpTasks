import User from '../models/User.js';
import generateId from '../helpers/generateid.js';
import generateJWT from '../helpers/generateJWT.js';
import { emailRegister, forgotPassword } from '../helpers/emails.js';

/**
 * Toma el correo electrónico del cuerpo de la solicitud, verifica si el usuario existe en la base de
 * datos, si existe, devuelve un error, si no, crea un nuevo usuario con el cuerpo de la solicitud,
 * genera un token, guarda el usuario en la base de datos y devuelve el usuario.*/
const register = async (req, res) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email }); //FINDONE VA A BUSCAR EN LA BASE DE DATOS EL PRIMERO QUE COINCIDA

  if (userExists) {
    //COMPROBAMOS QUE SI EL USUARIO EXISTE EN LA BASE DE DATOS NOS VA A DAR UN ERROR
    const error = new Error('Usuario ya registrado');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body); //CREAMOS UN OBJETO CON LA INFORMACION DEL MODELO
    user.token = generateId();
    await user.save(); //ALMACENAMOS EN LA BASE DE DATOS
    emailRegister({
      email: user.email,
      name: user.name,
      token: user.token,
    });
    res.json({
      msg: 'Usuario creado correctamente, revisa tu correo para confirmar tu cuenta',
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Si el usuario existe, está confirmado y la contraseña es correcta, devuelva la identificación, el
 * nombre, el correo electrónico y el token del usuario.*/
const authenticate = async (req, res) => {
  const { email, password } = req.body;
  //COMPROBAMOS SI EL USUARIO EXISTE
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('El usuario no existe');
    return res.status(400).json({ msg: error.message });
  }
  //COMPROBAMOS SI EL USUARIO ESTA COMFIRMADO
  if (!user.confirm) {
    const error = new Error('Tu cuenta no fue confirmada');
    return res.status(400).json({ msg: error.message });
  }
  //COMPROBAMOS LA PASSWORD
  if (await user.checkPassword(password)) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateJWT(user.id),
    });
  } else {
    const error = new Error('Password incorrecto');
    return res.status(400).json({ msg: error.message });
  }
};

/**
 * Toma un token de la URL, encuentra un usuario con ese token y, si encuentra uno, establece la
 * propiedad de confirmación del usuario en verdadero y la propiedad del token en una cadena vacía. */
const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });
  if (!userConfirm) {
    const error = new Error('Token no valido');
    return res.status(403).json({ msg: error.message });
  }

  try {
    userConfirm.confirm = true;
    userConfirm.token = '';
    await userConfirm.save();
    res.json({ msg: 'Usuario confirmado correctamente' });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Toma un correo electrónico del cuerpo de la solicitud, encuentra al usuario en la base de datos,
 * genera un token y guarda al usuario. */
const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('El usuario no existe');
    return res.status(400).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();
    forgotPassword({
      email: user.email,
      name: user.name,
      token: user.token,
    });
    res.json({ msg: 'Se envió un email con las instrucciones' });
  } catch (error) {
    console.log(error);
  }
};

/* Comprueba si el token es válido y si el usuario existe.*/
const checkToken = async (req, res) => {
  const { token } = req.params; //REQ.PARAMS PARA EXTRAER DATOS DE LA URL
  const validToken = await User.findOne({ token });

  if (validToken) {
    res.json({ msg: 'token valido y el usuario existe' });
  } else {
    const error = new Error('Token no valido');
    return res.status(400).json({ msg: error.message });
  }
};

/**
 * Toma un token de la URL y una contraseña del cuerpo, encuentra un usuario con ese token, establece
 * la contraseña en la nueva contraseña, establece el token en una cadena vacía y guarda al usuario. */
const newPassword = async (req, res) => {
  const { token } = req.params; //REQ.PARAMS PARA EXTRAER DATOS DE LA URL
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = '';

    try {
      await user.save();
      res.json({
        msg: 'Password modificado correctamente, redirigiendo en 1 segundo...',
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error('Token no valido');
    return res.status(400).json({ msg: error.message });
  }
};

/**
 * Toma el objeto de usuario del objeto de solicitud y lo envía de vuelta al cliente. */
const profile = async (req, res) => {
  const { user } = req;

  res.json(user);
};

export {
  register,
  authenticate,
  confirm,
  recoverPassword,
  checkToken,
  newPassword,
  profile,
};
