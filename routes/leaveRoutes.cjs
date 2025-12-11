const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController.cjs');
const authMiddleware = require('../middleware/auth.cjs');

// Mounted at /api
router.get('/leave-requests', authMiddleware, leaveController.getLeaveRequests);
router.post('/leave-requests', authMiddleware, leaveController.createLeaveRequest);
router.patch('/leave-requests/:id', authMiddleware, leaveController.updateLeaveRequest);

router.get('/leave-balances', authMiddleware, leaveController.getLeaveBalances);

module.exports = router;
