import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token for a user
 */
export const generateToken = (userId: number, email: string): string => {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { userId, email },
    config.jwtSecret,
    { expiresIn: (config.jwtExpiresIn || '7d') as any }
  );
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): { userId: number; email: string } => {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: number;
      email: string;
    };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
