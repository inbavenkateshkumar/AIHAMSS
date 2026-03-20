const pool = require('./config/database');
require('dotenv').config();

async function testSubstitutions() {
    try {
        const testDate = '2026-01-16'; // Today - Thursday
        const day = 'Thursday';

        console.log('\n=== TESTING SUBSTITUTION ASSIGNMENT ===\n');
        console.log(`Date: ${testDate} (${day})\n`);

        // Clear existing attendance for this date
        await pool.query('DELETE FROM attendance WHERE date = $1', [testDate]);
        console.log('✅ Cleared old attendance records');

        // Insert test attendance data
        // Mark some as Present, some as Absent
        const attendanceData = [
            { teacher_id: 1, status: 'Absent' },   // Rajesh - ABSENT
            { teacher_id: 2, status: 'Present' },  // Priya - PRESENT
            { teacher_id: 3, status: 'Present' },  // Amit - PRESENT
            { teacher_id: 4, status: 'Absent' },   // Anjali - ABSENT
            { teacher_id: 5, status: 'Present' },  // Vikram - PRESENT
            { teacher_id: 6, status: 'Present' },  // Meera - PRESENT
            { teacher_id: 7, status: 'Present' },  // Suresh - PRESENT
        ];

        for (const att of attendanceData) {
            await pool.query(
                'INSERT INTO attendance (teacher_id, date, status) VALUES ($1, $2, $3)',
                [att.teacher_id, testDate, att.status]
            );
        }
        console.log('✅ Inserted test attendance data\n');

        // Show status
        console.log('--- STATUS ---');
        console.log('ABSENT Teachers: Rajesh Kumar (ID 1), Anjali Patel (ID 4)');
        console.log('PRESENT Teachers: Priya, Amit, Vikram, Meera, Suresh\n');

        // Get absent teachers
        const absentResult = await pool.query(
            `SELECT t.id, t.name FROM teachers t
             WHERE t.id IN (
                SELECT teacher_id FROM attendance 
                WHERE date = $1 AND status = 'Absent'
             )`,
            [testDate]
        );

        console.log(`--- ABSENT TEACHERS FOR ${day} ---`);
        console.log(`Found ${absentResult.rows.length} absent teachers:`);
        absentResult.rows.forEach(t => {
            console.log(`  - ${t.name} (ID: ${t.id})`);
        });

        // Check if they have periods
        for (const absent of absentResult.rows) {
            const periods = await pool.query(
                'SELECT COUNT(*) as period_count FROM timetables WHERE teacher_id = $1 AND day = $2',
                [absent.id, day]
            );
            console.log(`    → Has ${periods.rows[0].period_count} periods on ${day}`);
        }

        // Get present teachers
        const presentResult = await pool.query(
            `SELECT t.id, t.name FROM teachers t
             WHERE t.id IN (
                SELECT teacher_id FROM attendance 
                WHERE date = $1 AND status = 'Present'
             )`,
            [testDate]
        );

        console.log(`\n--- PRESENT TEACHERS FOR ${day} ---`);
        console.log(`Found ${presentResult.rows.length} present teachers:`);
        presentResult.rows.forEach(t => {
            console.log(`  - ${t.name} (ID: ${t.id})`);
        });

        console.log('\n✅ Test data is ready! Now you can:');
        console.log('1. Go to Attendance page');
        console.log('2. Select 2026-01-16 (Thursday)');
        console.log('3. Verify the attendance matches above');
        console.log('4. Click "Assign Substitutions"');
        console.log('\nExpected: Substitutions should be assigned for Rajesh and Anjali');

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test error:', error.message);
        process.exit(1);
    }
}

testSubstitutions();
