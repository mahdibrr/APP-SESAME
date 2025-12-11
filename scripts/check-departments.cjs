const { sequelize, Department } = require('../models/index.cjs');

async function checkDepartments() {
    try {
        await sequelize.authenticate();
        const depts = await Department.findAll();
        console.log('--- DEPARTMENTS ---');
        console.log(JSON.stringify(depts, null, 2));
        console.log(`Total count: ${depts.length}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkDepartments();
