const pool = require('./config/database');
require('dotenv').config();

// Teacher data with their timetables
const teachersData = [
  {"id": 1, "name": "Meenatchi", "subject": "English", "schedule": {"Mon": ["6A", "9B", "11B", null, null, "6A", null, null], "Tue": ["6A", "11B", null, "11B", "11A", "11A", null, null], "Wed": ["9B", "6A", null, "11B", "11A", "11A", null, null], "Thu": ["6A", "11B", null, "11A", null, "11A", "9B", "9B"], "Fri": ["6A", null, "11A", "11B", "9B", "9B", null, "6A"]}},
  {"id": 2, "name": "G. Bhuvana", "subject": "Mathematics", "schedule": {"Mon": ["6B", "11B", "7A", null, "8A", "7B", "7B", "6B"], "Tue": ["6B", null, "6C", "6C", "6C", null, "7B", "7B"], "Wed": [null, "11B", "6B", "6A", null, "8B", "8B", "6B"], "Thu": ["11A", "6B", null, null, null, "7B", null, null], "Fri": [null, null, "11A", "11B", null, null, "11A", "6B"]}},
  {"id": 3, "name": "V. Valli", "subject": "Science", "schedule": {"Mon": ["7A", "11B", "6C", null, "8B", "6B", "7C", "7C"], "Tue": ["7B", "6C", "8A", "7B", "6A", null, null, null], "Wed": ["11A", "7A", "8B", "8C", null, null, "8B", "7C"], "Thu": [null, null, null, "7B", "8B", null, null, "8A"], "Fri": ["6B", "6B", "7B", "6C", null, "8A", "8B", "8B"]}},
  {"id": 4, "name": "Kumutha", "subject": "History", "schedule": {"Mon": ["6C", "7C", "7B", "7C", "6B", "6B", "7B", "6C"], "Tue": ["8A", "7B", "6A", "8C", "7A", "6A", null, null], "Wed": ["8A", "7B", "8C", null, "6B", "6B", null, "6C"], "Thu": [null, "6B", null, "8B", "7B", null, "7B", null], "Fri": [null, null, "7B", "6C", "7B", "7B", "6B", "6B"]}},
  {"id": 5, "name": "Valarmathi", "subject": "Geography", "schedule": {"Mon": ["7B", "8A", "8A", null, "8B", "9A", "10C", "6B"], "Tue": ["7C", "6B", "9A", "8C", "8B", "6C", "10C", "10C"], "Wed": ["6B", "8A", "7B", "9A", "6C", "7B", "6A", "6C"], "Thu": ["7A", "7B", "6B", "7B", "6C", "7C", "7B", "7B"], "Fri": ["7A", "6B", "6C", "8A", "7C", "8A", "7B", "7A"]}},
  {"id": 6, "name": "Nandhini", "subject": "Tamil", "schedule": {"Mon": ["7C", "6C", "6B", "10C", "9A", "10B", "7B", "8A"], "Tue": ["6B", "8B", "10B", "10C", "10B", "10B", "7B", "8A"], "Wed": ["7C", "6B", "10B", "9B", "8A", null, "6B", null], "Thu": ["6C", "6C", null, "8C", "7C", "9B", "7C", "7B"], "Fri": ["6B", "7B", "10B", "10B", "8B", "7C", "6B", "6B"]}},
  {"id": 7, "name": "Jeevitha", "subject": "English", "schedule": {"Mon": ["8A", "9B", "10C", "10C", "10A", "10B", "10B", "7C"], "Tue": ["10C", "8A", "8C", "10B", "6C", "10B", "10A", "10A"], "Wed": ["8C", "10C", "9B", "10C", "10A", "10A", "9B", "10B"], "Thu": ["7C", "10C", "10A", "8C", "10C", "10C", "10B", null], "Fri": ["7B", "8A", "10C", "10B", "10B", "10B", "10C", "7B"]}},
  {"id": 8, "name": "Deepa", "subject": "Mathematics", "schedule": {"Mon": ["10C", "10A", "10C", "7C", "12A", "7C", "8C", "12A"], "Tue": ["9B", "10C", "9C", "8B", "10A", "8B", "12A", "12A"], "Wed": ["6C", "9B", "8A", "12A", "6C", "10A", "10A", "9B"], "Thu": ["10B", "10C", "12A", "10B", "7A", "7C", null, null], "Fri": ["8A", "7C", null, "10C", "7C", "9B", "9B", "8A"]}},
  {"id": 9, "name": "Madheshwari", "subject": "Science", "schedule": {"Mon": ["8C", null, "10C", "12A", "9A", "8A", "7A", "9C"], "Tue": ["6C", "12A", null, "10A", "12A", "10B", "10B", "8B"], "Wed": ["10C", "11B", "12A", "10B", "11B", "7A", "10B", "10B"], "Thu": ["10B", "12A", "12A", "10B", "11B", "12A", "9C", "10C"], "Fri": [null, "6A", "12A", "10B", "12A", "10B", "10B", "8C"]}},
  {"id": 10, "name": "Mangalpriya", "subject": "English", "schedule": {"Mon": ["9A", null, "10A", "10A", "8C", "7A", "8A", "11B"], "Tue": ["12A", "11B", "9A", null, "10A", "10A", "11B", "10C"], "Wed": [null, "10C", "11B", null, "10C", "11B", "12A", "12A"], "Thu": ["12A", null, "12A", "9A", "11B", "10C", null, "12A"], "Fri": ["12A", "9A", "10A", "12B", "7A", "12A", "8C", null]}},
  {"id": 11, "name": "P. Subathra", "subject": "History", "schedule": {"Mon": ["9B", "12A", "6B", null, null, null, "9A", "12B"], "Tue": ["11B", "12B", "12B", "10B", "9B", "10B", "9A", null], "Wed": ["12B", "11B", "10A", "11B", "9A", "10B", "9A", "9A"], "Thu": ["11B", "12B", "9B", "10B", "10A", "9A", "11B", "12B"], "Fri": ["10B", "10B", "9B", "10A", "10A", "10A", "9A", "9B"]}},
  {"id": 12, "name": "Santhi", "subject": "Geography", "schedule": {"Mon": ["10B", "11B", "11B", null, "7A", "6B", "10B", "9B"], "Tue": ["10B", "12A", "11B", "9B", "9B", "11B", "9A", "12B"], "Wed": ["11B", "12B", "7B", "7A", "10B", "6B", "11B", "11B"], "Thu": ["9C", "11B", null, "8C", "12A", "10B", null, "11B"], "Fri": ["10A", "9B", "11B", "9B", null, "7A", "12A", null]}},
  {"id": 13, "name": "Bhuvaneshwari", "subject": "Tamil", "schedule": {"Mon": ["9C", "10B", "10B", "8C", "8A", "11C", "12B", "10A"], "Tue": ["10A", "8C", "10B", null, "12B", "11C", "11B", "10A"], "Wed": ["11C", "8B", "11B", "10B", "10B", "11C", "11C", "12B"], "Thu": ["11B", "10B", "11B", "12B", "10B", null, "10B", "10B"], "Fri": ["11B", "11B", null, "10A", "11B", "10A", "10B", "10A"]}},
  {"id": 14, "name": "Gokul", "subject": "English", "schedule": {"Mon": ["10A", "11C", "12C", null, "11C", "12B", null, "9C"], "Tue": ["9C", "10A", "9C", "11C", "9C", "10B", "10C", "10C"], "Wed": ["8A", "11C", "11C", "10A", "11C", "10A", "10A", "9C"], "Thu": ["8B", "11C", null, "9C", "11C", "12C", "11B", "12B"], "Fri": ["9C", "10A", "10B", "11C", "12A", "11C", "12B", "10A"]}},
  {"id": 15, "name": "Subaitha", "subject": "Mathematics", "schedule": {"Mon": ["10B", "12C", "11C", "12B", "9C", "10A", "8A", null], "Tue": ["11B", "9C", "8A", "11C", "9C", "9A", "10A", "10A"], "Wed": ["10A", "11C", "12C", "9A", "9A", "12B", "8A", "11C"], "Thu": ["10A", "11C", "10A", "9B", "12B", "11B", null, "12B"], "Fri": ["11C", "9C", "8A", "10A", "9C", "10A", "11C", "9B"]}},
  {"id": 16, "name": "K. Subathra", "subject": "Science", "schedule": {"Mon": ["11A", "10A", "9A", "12B", "9B", "8A", "10A", "10B"], "Tue": ["10B", "11A", "9B", "9B", "8A", "10C", "10C", "10B"], "Wed": ["11A", "10C", "11B", "10C", "11A", "10C", "11B", "10C"], "Thu": ["11A", null, "11A", "12B", "12B", "8A", null, null], "Fri": ["10A", "8B", "9C", "10C", "9B", "11C", "10C", "11B"]}},
  {"id": 17, "name": "Baby", "subject": "History", "schedule": {"Mon": ["11B", null, "12B", "9B", "9B", "11A", "8B", "11A"], "Tue": ["11A", "10B", "11A", "8B", "9B", "8B", "11A", null], "Wed": ["10B", "11A", "11A", "11A", "11A", null, "10A", "10A"], "Thu": ["11A", "9A", "10B", "11A", "9A", "10B", "11C", null], "Fri": ["11A", "9B", "11A", "12C", "10C", "10B", "11A", "11A"]}},
  {"id": 18, "name": "Arul Thayalan", "subject": "PE", "schedule": {"Mon": ["10B", "10B", "12C", "11A", "12C", "12B", "11C", "11C"], "Tue": ["12C", "12C", "9C", "12C", "12C", "12C", "9C", "9C"], "Wed": ["12B", "11A", "11C", "12C", "12C", "12C", "12C", null], "Thu": ["12C", "12C", "12C", "9C", "12C", "12C", "12C", null], "Fri": ["12C", "12B", "12C", "12C", "12C", "11A", "12C", "12C"]}},
  {"id": 19, "name": "Parthasarathi", "subject": "English", "schedule": {"Mon": ["12A", "12B", "11A", "11B", "12B", "12B", "9A", "12A"], "Tue": ["12B", "9A", null, "11B", "12A", "12A", "9C", "12A"], "Wed": ["12A", "12B", "11A", "12A", "11B", "11B", "11B", "12A"], "Thu": ["12A", "12B", "12C", "11A", "12A", "12A", null, null], "Fri": ["11A", "12A", "12A", "12B", "12B", "12A", "12A", "11A"]}},
  {"id": 20, "name": "Venkatachalam", "subject": "Mathematics", "schedule": {"Mon": ["12C", "11C", "12B", "11B", null, null, null, "11B"], "Tue": ["11B", "12B", "12B", "9A", null, "11B", null, "11B"], "Wed": ["12B", "11A", "11A", null, "11A", "11B", null, "11A"], "Thu": [null, null, "12B", "11B", "11B", null, null, "11B"], "Fri": ["11C", null, "12B", "12C", "11B", null, "11A", null]}},
  {"id": 21, "name": "Banu", "subject": "Science", "schedule": {"Mon": ["12B", "11A", "11B", "12A", "11A", "11A", "11A", "11A"], "Tue": ["11A", "12A", "11B", "11A", "12A", "11A", "11A", "12C"], "Wed": ["11A", "11A", "11A", "11A", "11A", "11A", "11A", "11A"], "Thu": ["11A", "11A", "11A", "11A", "11A", "11A", "11A", "11A"], "Fri": ["12B", "11A", "12B", "11A", "11A", "11A", "11A", "12A"]}},
  {"id": 22, "name": "Latha", "subject": "Geography", "schedule": {"Mon": ["12C", "11A", "12C", "11A", "12A", "11C", "12C", "11C"], "Tue": ["11C", "11C", null, "12A", "11A", "11A", "12C", "12C"], "Wed": ["12A", "12C", "11C", "11C", "11C", "12C", "12C", null], "Thu": ["11A", "12C", "12B", null, "11A", "11B", "11B", "11B"], "Fri": ["12C", "11C", "11C", "11C", "12C", "12C", "11B", "11B"]}},
  {"id": 23, "name": "Nithya", "subject": "Tamil", "schedule": {"Mon": ["7B", "6B", "9A", "7B", "7B", "8B", "11C", "12C"], "Tue": ["7A", "8B", "7A", "11C", "7C", "8C", "6C", "8C"], "Wed": ["8B", "7B", "7A", "8B", "12C", "12B", "7C", "8B"], "Thu": ["12C", "6B", "7B", "11A", "7C", "12C", "8B", "11A"], "Fri": ["11B", "7C", "12B", "12C", "7C", "12C", "12C", "12C"]}},
  {"id": 24, "name": "Sathya", "subject": "English", "schedule": {"Mon": ["8B", "7B", "6A", "11C", "6B", "6A", "7A", "9C"], "Tue": ["6A", "7B", "6A", "6C", "7C", "6A", "6C", "6A"], "Wed": ["7C", "9A", "10A", "6A", "7B", "6A", "7B", "7A"], "Thu": ["6B", "7C", "6A", "7A", "6A", "6A", "6A", "6A"], "Fri": ["7C", "7B", "6A", "6B", "7B", "6B", "6A", "7C"]}},
  {"id": 25, "name": "Mary Fathima", "subject": "Mathematics", "schedule": {"Mon": ["11C", "8C", "11C", "11C", null, "12C", "11A", null], "Tue": ["12C", "12C", "11C", "11C", "11C", "12C", "12B", "12C"], "Wed": ["12C", "8B", "12C", "12C", "12B", "12C", "11C", "11C"], "Thu": ["11C", "11C", "12C", "12C", "11C", "11C", "11A", null], "Fri": ["11C", "12C", "11C", "11C", "11C", "11C", "11A", "11C"]}},
  {"id": 26, "name": "PT Sir", "subject": "PE", "schedule": {"Mon": ["6C", null, "7B", "8C", "8B", "7A", null, null], "Tue": ["11C", "12C", "8B", "7A", "12B", "8C", "11B", "7B"], "Wed": ["11A", "11B", "8B", "6C", "11A", "11A", "8B", "8B"], "Thu": ["8B", "11A", "11A", "6A", "6A", "6B", "7A", null], "Fri": ["10C", "11B", "8B", "8A", "11A", "10A", "8B", "7B"]}},
  {"id": 27, "name": "Manjula", "subject": "Science", "schedule": {"Mon": ["8C", "8B", "6A", null, "10C", "12A", "11C", "7C"], "Tue": ["6B", "6A", "10A", null, "6B", "12B", "11C", null], "Wed": ["6B", "6A", "11C", "10B", "11C", "11B", "8B", "11B"], "Thu": ["12C", "11A", "11A", "11C", "11C", "12C", "12A", "10A"], "Fri": ["12A", "10C", "11C", "11B", "11C", "11C", "10C", "9C"]}},
  {"id": 28, "name": "Anuradha", "subject": "English", "schedule": {"Mon": ["6A", "6A", "7A", null, "6A", "6A", "8C", null], "Tue": ["6A", "6B", "6A", "6A", "8C", "7A", "8C", null], "Wed": ["6A", "6A", "7A", "6A", "6A", "6B", "7A", "6B"], "Thu": ["7A", "6A", "6B", "8A", "6B", "6B", "6B", "6A"], "Fri": ["6A", "6A", "7A", "12C", "12A", "8A", "11A", "11A"]}},
  {"id": 29, "name": "Sr. Maggie", "subject": "History", "schedule": {"Mon": ["7A", null, null, null, "6A", "6A", null, null], "Tue": [null, null, "7A", null, "6A", null, null, null], "Wed": ["7A", "6A", "6A", null, "6A", "6A", "7A", null], "Thu": [null, "8A", "7A", "6A", null, "6A", null, null], "Fri": ["7A", "7A", null, "6A", "7A", "6A", null, null]}}
];

async function setupData() {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await client.query('DELETE FROM notifications');
        await client.query('DELETE FROM substitutions');
        await client.query('DELETE FROM attendance');
        await client.query('DELETE FROM timetables');
        await client.query('DELETE FROM teachers WHERE id > 0');
        
        // Insert teachers
        console.log('📚 Importing teachers...');
        for (const teacher of teachersData) {
            await client.query(
                'INSERT INTO teachers (id, name, subject, max_substitution_limit, current_substitution_count) VALUES ($1, $2, $3, $4, $5)',
                [teacher.id, teacher.name, teacher.subject, 3, 0]
            );
        }
        
        // Insert timetables
        console.log('📅 Importing timetables...');
        const dayMap = { 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday' };
        const dayKeys = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        let timetableCount = 0;
        
        for (const teacher of teachersData) {
            for (const dayKey of dayKeys) {
                const classes = teacher.schedule[dayKey] || [];
                const dayName = dayMap[dayKey];
                for (let period = 0; period < classes.length; period++) {
                    const className = classes[period];
                    if (className) { // Only insert if not null
                        await client.query(
                            'INSERT INTO timetables (teacher_id, day, period_number, class_name, subject) VALUES ($1, $2, $3, $4, $5)',
                            [teacher.id, dayName, period + 1, className, teacher.subject]
                        );
                        timetableCount++;
                    }
                }
            }
        }
        
        await client.query('COMMIT');
        console.log(`\n✅ Setup completed successfully!`);
        console.log(`   - Teachers imported: ${teachersData.length}`);
        console.log(`   - Timetable entries: ${timetableCount}`);
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Setup failed:', error);
        process.exit(1);
    } finally {
        client.release();
        process.exit(0);
    }
}

setupData();
