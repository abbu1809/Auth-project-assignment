import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokens, verifyRefreshToken } from '../utils/auth.utils.js';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

/*
Register controller
*/
export const registerUserController = async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;

  const isUserExist = await userModel.findOne({ email });

  if (isUserExist) {
    return res.status(400).json({
      message: 'User already exists with this email',
      errors: [
        {
          path: 'email',
          msg: 'User already exists with this email',
        },
      ],
    });
  }
  //check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Password and confirm password do not match',
      errors: [
        {
          path: 'confirmPassword',
          msg: 'Password and confirm password do not match',
        },
      ],
    });
  }

  const user = await userModel.create({
    email,
    name,
    hashedPassword: await bcrypt.hash(password, 12),
  });

  const { accessToken, refreshToken } = generateTokens({
    userId: user._id,
    role: user.role,
  });

  await userModel.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  return res.status(201).json({
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
};

/*
Login controller
*/
export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: 'Invalid email or password',
      errors: [
        {
          path: 'email',
          msg: 'Invalid email or password',
        },
      ],
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: 'Invalid email or password',
      errors: [
        {
          path: 'email',
          msg: 'Invalid email or password',
        },
      ],
    });
  }

  const { accessToken, refreshToken } = generateTokens({
    userId: user._id,
    role: user.role,
  });

  await userModel.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  return res.status(200).json({
    message: 'User logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
};

/*
Refresh token controller
*/
export const getRefreshController = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: 'Refresh token not found',
    });
  }

  try {
    const decoded = verifyRefreshToken(token);

    // generateTokens stores the user ID as "id"
    const { id } = decoded;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    if (token !== user.refreshToken) {
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });

      res.clearCookie('refreshToken', refreshCookieOptions);

      return res.status(401).json({
        message: 'Refresh token mismatch',
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user._id,
      role: user.role,
    });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: 'Tokens refreshed successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid refresh token',
    });
  }
};
/*
get me controller
*/

export const getMeController = async (req, res) => {
  const { userId, role } = req.user;

  const user = await userModel.findById(userId);

  res.status(200).json({
    message: 'User fetched successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    },
  });
};

/**
 * logout controller
 */
export const logoutController = async (req, res) => {
  const { userId } = req.user;

  await userModel.findByIdAndUpdate(userId, {
    refreshToken: null,
  });

  res.clearCookie('refreshToken', refreshCookieOptions);

  return res.status(200).json({
    message: 'User logged out successfully',
  });
};
