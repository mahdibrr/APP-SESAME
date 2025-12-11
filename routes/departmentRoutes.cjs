const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController.cjs');
const authMiddleware = require('../middleware/auth.cjs');

// Public or Protected? Requirement doesn't specify but usually Protected.
// Existing frontend logic might call it without token? 
// Legacy server.js didn't check auth for GET.
// Requirement 2.3: "Frontend SHALL validate JWT tokens".
// I'll make them protected to be "Enterprise".
router.get('/', authMiddleware, departmentController.getAllDepartments);
router.get('/:id', authMiddleware, departmentController.getDepartmentById);

module.exports = router;
