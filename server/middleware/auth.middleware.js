import { verifyToken, extractTokenFromHeader } from '../utils/auth.js';
import prisma from '../database/prisma.js';
export const authenticate = async (req, res, next) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
                code: 'AUTH_REQUIRED',
            });
            return;
        }
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                error: 'Invalid or inactive user',
                code: 'INVALID_USER',
            });
            return;
        }
        req.user = {
            id: user.id,
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token',
            code: 'INVALID_TOKEN',
        });
    }
};
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
                code: 'AUTH_REQUIRED',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
                code: 'FORBIDDEN',
                required: allowedRoles,
                current: req.user.role,
            });
            return;
        }
        next();
    };
};
export const optionalAuth = async (req, _res, next) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        if (token) {
            const decoded = verifyToken(token);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isActive: true,
                },
            });
            if (user && user.isActive) {
                req.user = {
                    id: user.id,
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                };
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
