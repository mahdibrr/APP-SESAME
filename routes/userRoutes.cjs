const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.cjs');
const authMiddleware = require('../middleware/auth.cjs');

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;
