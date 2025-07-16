const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res
      .status(403)
      .json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

module.exports = adminAuth;
