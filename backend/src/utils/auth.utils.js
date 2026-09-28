import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateTokens = ({ userId, role }) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  );
  const refreshToken = jwt.sign(
    { id: userId, role },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return { accessToken, refreshToken };
};

export function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);
  return decoded;
}

export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
  return decoded;
}
