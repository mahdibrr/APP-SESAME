'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
            User.belongsTo(models.User, { foreignKey: 'supervisorId', as: 'supervisor' });
            User.hasMany(models.User, { foreignKey: 'supervisorId', as: 'subordinates' });
            User.hasMany(models.LeaveRequest, { foreignKey: 'userId', as: 'leaveRequests' });
            User.hasMany(models.LeaveBalance, { foreignKey: 'userId', as: 'leaveBalances' });
            User.hasMany(models.Notification, { foreignKey: 'recipientId', as: 'notifications' });
        }
    }
    User.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        role: {
            type: DataTypes.ENUM('ADMIN', 'HR', 'CHEF_DEPARTEMENT', 'ENSEIGNANT'),
            defaultValue: 'ENSEIGNANT'
        },
        departmentId: DataTypes.STRING,
        supervisorId: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users'
    });
    return User;
};
