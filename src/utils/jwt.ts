import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { StringValue } from 'ms';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as StringValue,
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    return null; // Token inválido o expirado
  }
};