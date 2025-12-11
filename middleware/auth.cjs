const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models/index.cjs');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user || user.isActive === false) {
            return res.status(401).json({ error: 'Unauthorized: User not found or inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
