import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Set userId directly as other routes expect
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

// Optional auth - doesn't fail if no token, just sets userId if token exists
export const optionalAuth = (req, res, next) => {
    const token = req.headers.token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id; // Set userId if token is valid
        } catch (error) {
            // Invalid token, but we continue anyway for optional auth
            console.log('Optional auth: Invalid token, continuing without userId');
        }
    }
    next(); // Always proceed, regardless of token
}

export default authUser
