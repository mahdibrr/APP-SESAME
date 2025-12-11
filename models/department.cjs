'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        static associate(models) {
            Department.hasMany(models.User, { foreignKey: 'departmentId', as: 'users' });
        }
    }
    Department.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        name: DataTypes.STRING,
        code: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Department',
        tableName: 'Departments'
    });
    return Department;
};
