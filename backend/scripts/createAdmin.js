const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config({ path: '../config/config.env' });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rohan:kankimagi@cluster0.ecwot4i.mongodb.net/flipkart?appName=Cluster0";

/**
 * Admin Seeder Script
 * Creates superadmin, admin, and test user accounts
 *
 * Usage:
 * node backend/scripts/createAdmin.js
 */

const adminUsers = [
    {
        name: "Super Admin",
        email: "superadmin@tiles.com",
        gender: "male",
        password: "superadmin123",
        role: "superadmin"
    },
    {
        name: "Admin User",
        email: "admin@tiles.com",
        gender: "female",
        password: "admin123456",
        role: "admin"
    },
    {
        name: "Test User",
        email: "user@tiles.com",
        gender: "male",
        password: "user12345678",
        role: "user"
    }
];

const createAdminUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('\n✅ MongoDB Connected Successfully!\n');

        // Check if users already exist
        for (const adminData of adminUsers) {
            const existingUser = await User.findOne({ email: adminData.email });

            if (existingUser) {
                console.log(`⚠️  User already exists: ${adminData.email} (${adminData.role})`);

                // Update role if different
                if (existingUser.role !== adminData.role) {
                    existingUser.role = adminData.role;
                    await existingUser.save({ validateBeforeSave: false });
                    console.log(`   ✅ Updated role to: ${adminData.role}`);
                }
            } else {
                // Create new user
                const user = await User.create(adminData);
                console.log(`✅ Created: ${user.email} (${user.role})`);
                console.log(`   Password: ${adminData.password}`);
            }
        }

        console.log('\n🎉 Admin seeder completed successfully!\n');
        console.log('📋 Login Credentials:\n');
        console.log('┌─────────────────────────────────────────────────────┐');
        console.log('│ SUPERADMIN ACCOUNT                                  │');
        console.log('├─────────────────────────────────────────────────────┤');
        console.log('│ Email:    superadmin@tiles.com                      │');
        console.log('│ Password: superadmin123                             │');
        console.log('├─────────────────────────────────────────────────────┤');
        console.log('│ ADMIN ACCOUNT                                       │');
        console.log('├─────────────────────────────────────────────────────┤');
        console.log('│ Email:    admin@tiles.com                           │');
        console.log('│ Password: admin123456                               │');
        console.log('├─────────────────────────────────────────────────────┤');
        console.log('│ TEST USER ACCOUNT                                   │');
        console.log('├─────────────────────────────────────────────────────┤');
        console.log('│ Email:    user@tiles.com                            │');
        console.log('│ Password: user12345678                              │');
        console.log('└─────────────────────────────────────────────────────┘\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error creating admin users:');
        console.error(error.message);
        process.exit(1);
    }
};

// Run the seeder
createAdminUsers();
