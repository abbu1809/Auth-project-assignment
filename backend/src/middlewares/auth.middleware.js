import { verifyAccessToken } from '../utils/auth.utils.js';
export function authenticate(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({
      message: 'Access token not found',
    });
  }
  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid access token',
    });
  }
}

export function authenticateSeller(req, res, next) {
  if (req.user.role !== 'seller') {
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to do this action',
    });
  }
  next();
}
