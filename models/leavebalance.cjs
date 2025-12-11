'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LeaveBalance extends Model {
        static associate(models) {
            LeaveBalance.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    LeaveBalance.init({
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
        totalAllocation: DataTypes.INTEGER,
        used: DataTypes.FLOAT,
        remaining: DataTypes.FLOAT,
        year: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'LeaveBalance',
        tableName: 'LeaveBalances'
    });
    return LeaveBalance;
};
