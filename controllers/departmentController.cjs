const { Department } = require('../models/index.cjs');

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ error: 'Not found' });
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
