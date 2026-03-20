const db = require('./config/database');
const teachersData = require('./data/teachers.json');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

async function loadTeachersData() {
    try {
        console.log('Starting to load teacher data...');
        
        for (const teacher of teachersData) {
            // First, insert or update teacher
            const teacherQuery = `
                INSERT INTO teachers (id, name, email, phone, subject)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    subject = EXCLUDED.subject
            `;
            
            await db.query(teacherQuery, [
                teacher.id,
                teacher.name,
                `${teacher.name.toLowerCase().replace(/\s+/g, '.')}@holyangels.edu.in`,
                '9876543210', // Default phone
                'Various' // Default subject
            ]);
            
            // Now insert timetable entries for each day and period
            for (const dayIndex in days) {
                const day = days[dayIndex];
                const schedule = teacher.schedule[day];
                
                if (schedule && Array.isArray(schedule)) {
                    for (let periodNumber = 1; periodNumber <= schedule.length; periodNumber++) {
                        const classRoom = schedule[periodNumber - 1];
                        
                        // Skip if no class assigned
                        if (!classRoom) continue;
                        
                        const timetableQuery = `
                            INSERT INTO timetables (teacher_id, day, period_number, class_name, subject)
                            VALUES ($1, $2, $3, $4, $5)
                            ON CONFLICT (teacher_id, day, period_number) DO UPDATE SET
                                class_name = EXCLUDED.class_name
                        `;
                        
                        await db.query(timetableQuery, [
                            teacher.id,
                            day,
                            periodNumber,
                            classRoom,
                            'Subject' // Generic subject
                        ]);
                    }
                }
            }
            
            console.log(`✓ Loaded teacher: ${teacher.name} with timetable`);
        }
        
        console.log('\n✅ All teacher data loaded successfully!');
        console.log(`Total teachers added: ${teachersData.length}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error loading teacher data:', err.message);
        process.exit(1);
    }
}

// Run the function
loadTeachersData();
