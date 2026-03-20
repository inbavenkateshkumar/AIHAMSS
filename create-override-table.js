const pool = require('./config/database');

const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS day_overrides (
                date DATE PRIMARY KEY,
                day_to_follow VARCHAR(20) NOT NULL CHECK (day_to_follow IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ day_overrides table created successfully');
    } catch (error) {
        console.error('❌ Error creating table:', error);
    } finally {
        pool.end();
    }
};

createTable();
