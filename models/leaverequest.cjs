'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LeaveRequest extends Model {
        static associate(models) {
            LeaveRequest.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            LeaveRequest.belongsTo(models.User, { foreignKey: 'reviewerId', as: 'reviewer' });
        }
    }
    LeaveRequest.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        leaveType: DataTypes.STRING,
        startDate: DataTypes.DATEONLY,
        endDate: DataTypes.DATEONLY,
        reason: DataTypes.TEXT,
        status: {
            type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
            defaultValue: 'PENDING'
        },
        reviewerId: DataTypes.STRING,
        reviewerComments: DataTypes.TEXT,
        submittedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'LeaveRequest',
        tableName: 'LeaveRequests'
    });
    return LeaveRequest;
};
