import User from '../models/User.js';
import generateId from '../helpers/generateid.js';

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
    const userSave = await user.save(); //ALMACENAMOS EN LA BASE DE DATOS
    res.json(userSave);
  } catch (error) {
    console.log(error);
  }
};

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
    });
  } else {
    const error = new Error('Password incorrecto');
    return res.status(400).json({ msg: error.message });
  }
};

export { register, authenticate };
