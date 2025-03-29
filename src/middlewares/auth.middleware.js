import jwt from 'jsonwebtoken';

export const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Expect the token in the Authorization header

  if (!token) {
    return res.status(401).json({
      message: 'No token provided. Authorization denied.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'yourSecretKey'); // Verify the token using the secret key

    // Attach the decoded information to the request object
    req.admin = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token. Authorization denied.',
    });
  }
};
