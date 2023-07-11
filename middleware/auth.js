import jwt from 'jsonwebtoken';

function verifyAPIToken(req, res, next) {
  const secretKey = process.env.API_SECRET_KEY;
  const token = req.headers['x-api-key'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    next();
  });
}

export { verifyAPIToken };