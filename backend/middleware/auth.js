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


export default authUser
