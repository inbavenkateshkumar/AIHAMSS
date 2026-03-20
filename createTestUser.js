const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    try {
        console.log('Creating test user...');
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);
        
        // Insert test user
        const result = await db.query(
            `INSERT INTO users (username, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
             RETURNING id, username, email, role`,
            ['admin', 'admin@holyangels.edu.in', passwordHash, 'incharge']
        );
        
        console.log('\n✅ Test user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Role: Incharge');
        console.log('\nYou can now log in and access the dashboard.');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating test user:', err.message);
        process.exit(1);
    }
}

createTestUser();
