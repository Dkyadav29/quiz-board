const authenticate = require('./authenticate');

const adminOnly = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  });
};

module.exports = adminOnly;
