const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  // Verifica qué datos llegan en la solicitud
  console.log('Datos recibidos para registro:', req.body);
  
  const { username, email, password } = req.body;

  // Validar los campos requeridos
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Por favor, proporciona todos los campos requeridos.' });
  }

  try {
    // Verifica si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Crea un nuevo usuario
    user = new User({
      username,
      email,
      password,
    });

    // Guarda el usuario en la base de datos
    await user.save();

    // Crea un token JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error al registrar el usuario:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Inicio de sesión de usuario
exports.login = async (req, res) => {
  // Verifica qué datos llegan en la solicitud
  console.log('Datos recibidos para inicio de sesión:', req.body);
  
  const { email, password } = req.body;

  // Validar los campos requeridos
  if (!email || !password) {
    return res.status(400).json({ msg: 'Por favor, proporciona ambos campos: email y contraseña.' });
  }

  try {
    // Busca el usuario por email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    // Compara la contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // Crea un token JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error al iniciar sesión:', err.message);
    res.status(500).send('Error en el servidor');
  }
};
