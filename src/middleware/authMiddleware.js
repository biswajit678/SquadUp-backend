import jwt from 'jsonwebtoken';
import User from '../models/auth.models.js';

export const protect = async (req, res, next) => {
    let token;
    try {
        if (req.headers.Authorization && req.headers.Authorization.startswith('Bearee')) {
            token = req.headers.Authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        next();
    } catch (error) {

        console.error('Auth middleware error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token expired'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        });

    }
}


