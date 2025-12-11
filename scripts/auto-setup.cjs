const { Sequelize } = require('sequelize');
require('dotenv').config();

async function setupDatabase() {
    console.log('🚀 Starting automatic database setup...');
    
    try {
        // Create Sequelize instance
        const sequelize = new Sequelize(
            process.env.DB_NAME || 'university_leave_db',
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: 'mysql',
                logging: console.log,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        );

        // Test connection
        console.log('📡 Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');

        // Import models
        console.log('📋 Setting up database models...');
        const db = require('../models/index.cjs');
        
        // Sync all models (create tables)
        console.log('🔨 Creating database tables...');
        await db.sequelize.sync({ force: false }); // Set to true to recreate tables
        console.log('✅ Database tables created successfully!');

        // Create default admin user if not exists
        console.log('👤 Creating default admin user...');
        const bcrypt = require('bcryptjs');
        
        const [adminUser, created] = await db.User.findOrCreate({
            where: { email: 'admin@university.edu' },
            defaults: {
                firstName: 'System',
                lastName: 'Administrator',
                email: 'admin@university.edu',
                password: await bcrypt.hash('admin123', 10),
                role: 'admin',
                employeeId: 'ADMIN001',
                isActive: true
            }
        });

        if (created) {
            console.log('✅ Default admin user created!');
            console.log('📧 Email: admin@university.edu');
            console.log('🔑 Password: admin123');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create default departments
        console.log('🏢 Creating default departments...');
        const departments = [
            { name: 'Computer Science', code: 'CS' },
            { name: 'Mathematics', code: 'MATH' },
            { name: 'Physics', code: 'PHYS' },
            { name: 'Human Resources', code: 'HR' }
        ];

        for (const dept of departments) {
            await db.Department.findOrCreate({
                where: { code: dept.code },
                defaults: dept
            });
        }
        console.log('✅ Default departments created!');

        console.log('🎉 Database setup completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

// Run setup
setupDatabase();