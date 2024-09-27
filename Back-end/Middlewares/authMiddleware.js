const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;  // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;  // Attach the decoded user info to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};


