// Paste full auth middleware code here
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  authMiddleware: async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email });
      if (!user) return res.status(401).json({ msg: 'Invalid token' });
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token expired' });
    }
  }
};