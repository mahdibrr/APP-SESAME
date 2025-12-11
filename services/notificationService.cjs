const { Notification } = require('../models/index.cjs');
const socketService = require('./socketService.cjs');
const { v4: uuidv4 } = require('uuid'); // Or use Date.now() based ID as per legacy

// Use Date-based ID to respect legacy format if needed, or UUID.
// Legacy: `notif-${Date.now()}-sup`
const generateId = (suffix) => `notif-${Date.now()}-${suffix || Math.floor(Math.random() * 1000)}`;

exports.createNotification = async (data) => {
    try {
        const notif = await Notification.create({
            id: data.id || generateId('gen'),
            ...data,
            isRead: false,
            createdAt: new Date()
        });

        // Real-time send
        socketService.sendToUser(data.recipientId, {
            type: 'notification',
            notification: notif.toJSON()
        });

        return notif;
    } catch (error) {
        console.error('Notification creation failed:', error);
        // Don't throw, just log. Notifications shouldn't break main flow.
    }
};
