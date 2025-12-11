const fs = require('fs');
const path = require('path');
const { sequelize, User, Department, LeaveRequest, LeaveBalance, Notification } = require('../models/index.cjs');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../db.json');

const mysql = require('mysql2/promise');

async function migrate() {
    try {
        console.log('🔄 Checking Database...');
        // Create DB if not exists
        const env = process.env.NODE_ENV || 'development';
        const config = require('../config/config.cjs')[env];

        const connection = await mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
        await connection.end();
        console.log('✅ Database checked/created.');

        console.log('🔄 Connecting to Sequelize...');
        await sequelize.authenticate();
        console.log('✅ Connected.');

        console.log('⚠️  Syncing Database (FORCE)...');
        await sequelize.sync({ force: true });
        console.log('✅ Database Synced.');

        // Read JSON Data
        if (!fs.existsSync(DB_FILE)) {
            console.error('❌ db.json not found!');
            process.exit(1);
        }
        const jsonData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

        // 1. Departments
        console.log('📂 Migrating Departments...');
        if (jsonData.departments && jsonData.departments.length > 0) {
            await Department.bulkCreate(jsonData.departments);
            console.log(`✅ ${jsonData.departments.length} departments migrated.`);
        }

        // 2. Users
        console.log('👤 Migrating Users...');
        if (jsonData.users && jsonData.users.length > 0) {
            const defaultPassword = await bcrypt.hash('user123', 10);
            const users = jsonData.users.map(u => ({
                ...u,
                password_hash: defaultPassword, // Set default password
                supervisorId: u.supervisorId // FK will be checked
            }));

            // Disable FK checks temporarily for self-referencing and ordering issues
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            await User.bulkCreate(users);
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log(`✅ ${users.length} users migrated.`);
        }

        // 3. Leave Balances
        console.log('💰 Migrating Leave Balances...');
        if (jsonData.leaveBalances && jsonData.leaveBalances.length > 0) {
            await LeaveBalance.bulkCreate(jsonData.leaveBalances);
            console.log(`✅ ${jsonData.leaveBalances.length} balances migrated.`);
        }

        // 4. Leave Requests
        console.log('📝 Migrating Leave Requests...');
        if (jsonData.leaveRequests && jsonData.leaveRequests.length > 0) {
            const requests = jsonData.leaveRequests.map(r => ({
                ...r,
                reviewerId: r.reviewerId || null
            }));
            await LeaveRequest.bulkCreate(requests);
            console.log(`✅ ${requests.length} requests migrated.`);
        }

        // 5. Notifications
        console.log('🔔 Migrating Notifications...');
        if (jsonData.notifications && jsonData.notifications.length > 0) {
            const notifs = jsonData.notifications.map(n => ({
                ...n,
                leaveRequestId: n.leaveRequestId
            }));
            await Notification.bulkCreate(notifs);
            console.log(`✅ ${notifs.length} notifications migrated.`);
        }

        console.log('🎉 MIGRATION COMPLETE!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
}

migrate();
