const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No se proporcionó un token de acceso' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mgnb_vapo_secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'bloqueado temporalmente por motivos de licencia mgnb' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
};

module.exports = { auth, admin };
