
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your_super_secret_key_study_planner';

export const protect = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'غير مسموح بالدخول، التوكن مفقود' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'التوكن غير صالح أو منتهي الصلاحية' });
    }
};
