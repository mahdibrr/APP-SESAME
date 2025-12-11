const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController.cjs');
const authMiddleware = require('../middleware/auth.cjs');

router.get('/', authMiddleware, notificationController.getNotifications);
router.patch('/:id/read', authMiddleware, notificationController.markRead);
router.patch('/read-all', authMiddleware, notificationController.markAllRead);

module.exports = router;
