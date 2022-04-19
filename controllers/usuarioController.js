import User from '../models/User.js';

const register = (req, res) => {
  console.log(req.body);
  res.json({ msg: 'funciona' });
};

export { register };
