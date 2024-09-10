const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized access!' });
      } else {
        req.user = decodedToken; // Attach user data to the request
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized access!' });
  }
};
