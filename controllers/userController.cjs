const { User, Department } = require('../models/index.cjs');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res) => {
    try {
        const where = {};
        if (req.query.departmentId) where.departmentId = req.query.departmentId;
        if (req.query.supervisorId) where.supervisorId = req.query.supervisorId;

        const users = await User.findAll({
            where,
            attributes: { exclude: ['password_hash'] },
            include: [{ model: Department, as: 'department' }]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] },
            include: [{ model: Department, as: 'department' }]
        });
        if (!user) return res.status(404).json({ error: 'Not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
