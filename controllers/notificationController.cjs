const { Notification } = require('../models/index.cjs');

exports.getNotifications = async (req, res) => {
    try {
        const where = {};
        if (req.query.recipientId) where.recipientId = req.query.recipientId;

        const notifications = await Notification.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markRead = async (req, res) => {
    try {
        const notif = await Notification.findByPk(req.params.id);
        if (notif) {
            await notif.update({ isRead: true, readAt: new Date() });
        }
        res.json(notif);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAllRead = async (req, res) => {
    try {
        const { recipientId } = req.body;
        if (recipientId) {
            await Notification.update(
                { isRead: true, readAt: new Date() },
                { where: { recipientId, isRead: false } }
            );
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
