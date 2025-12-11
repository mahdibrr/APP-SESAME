'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.User, { foreignKey: 'recipientId', as: 'recipient' });
            Notification.belongsTo(models.LeaveRequest, { foreignKey: 'leaveRequestId', as: 'leaveRequest' });
        }
    }
    Notification.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        recipientId: DataTypes.STRING,
        leaveRequestId: DataTypes.STRING,
        type: DataTypes.STRING,
        title: DataTypes.STRING,
        message: DataTypes.TEXT,
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        readAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Notification',
        tableName: 'Notifications'
    });
    return Notification;
};
