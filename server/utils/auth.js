import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');
export const hashPassword = async (password) => {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
};
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
export const generateAccessToken = (payload) => {
    const options = {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'construction-management',
        audience: 'construction-management-api',
    };
    return jwt.sign(payload, JWT_SECRET, options);
};
export const generateRefreshToken = () => {
    const options = {
        expiresIn: '30d',
        issuer: 'construction-management',
        audience: 'construction-management-api',
    };
    return jwt.sign({}, JWT_SECRET, options);
};
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'construction-management',
            audience: 'construction-management-api',
        });
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
};
export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
};
