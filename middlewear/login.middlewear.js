const jwt = require('jsonwebtoken');

function isLogin(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('You are not logged in. Please log in first.');
  }

  try {
    const decoded = jwt.verify(token, process.env.SEC_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).send('Unauthorized');
  }
}

module.exports = isLogin;
