import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

export type UserRole = 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'WORKER' | 'CLIENT';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
    issuer: 'construction-management',
    audience: 'construction-management-api',
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (): string => {
  const options: SignOptions = {
    expiresIn: '30d' as any,
    issuer: 'construction-management',
    audience: 'construction-management-api',
  };

  return jwt.sign({}, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'construction-management',
      audience: 'construction-management-api',
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
