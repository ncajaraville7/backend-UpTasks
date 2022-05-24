import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//VERIFICA QUE EL JSON WEB TOKEN SEA VALIDO QUE EXISTA QUE ESTE ENVIADO VIA HEADERS Y SI TODO ESTA BIEN VA A PROFILE

/**
 * Si la solicitud tiene un encabezado de autorización que comienza con 'Bearer', intente verificar
 * el token, si es válido, luego establezca la propiedad de usuario en el objeto de solicitud para el
 * usuario que fue encontrado por la identificación decodificada, y luego llame a next( ) para pasar la
 * solicitud al siguiente middleware.
 *
 * Si el token no es válido, devuelve un error 404.
 *
 * Si no hay token, devuelva un error 401.
 *
 * Si el token es válido, llame a next() para pasar la solicitud al siguiente middleware.*/
const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select(
        '-password -confirm -token -createdAt -updatedAt -__v'
      );
      return next();
    } catch (error) {
      return res.status(404).json({ msg: 'Hubo un error' });
    }
  }

  if (!token) {
    const error = new Error('Token no valido');
    return res.status(401).json({ msg: error.message });
  }
  next(); //NEXT NOS PERMITE PASAR AL SIGUIENTE MIDDLEWARE
};

export default checkAuth;
