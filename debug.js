const pool = require('./config/database');
require('dotenv').config();

async function debugSubstitutions() {
    try {
        // Test date
        const testDate = '2026-01-16'; // Today
        const day = 'Thursday'; // Current day

        console.log('\n=== DEBUG SUBSTITUTION ASSIGNMENT ===\n');
        console.log(`Testing for date: ${testDate}, day: ${day}`);

        // 1. Check all teachers
        console.log('\n--- ALL TEACHERS ---');
        const teachersResult = await pool.query('SELECT id, name, subject, max_substitution_limit FROM teachers');
        console.log(`Found ${teachersResult.rows.length} teachers:`);
        teachersResult.rows.forEach(t => {
            console.log(`  - ID ${t.id}: ${t.name} (${t.subject}) - Max substitutions: ${t.max_substitution_limit}`);
        });

        // 2. Check attendance for test date
        console.log(`\n--- ATTENDANCE FOR ${testDate} ---`);
        const attendanceResult = await pool.query(
            'SELECT a.*, t.name FROM attendance a JOIN teachers t ON a.teacher_id = t.id WHERE a.date = $1 ORDER BY t.name',
            [testDate]
        );
        console.log(`Found ${attendanceResult.rows.length} attendance records:`);
        attendanceResult.rows.forEach(a => {
            console.log(`  - ${a.name}: ${a.status}`);
        });

        // 3. Check timetables for the day
        console.log(`\n--- TIMETABLES FOR ${day} ---`);
        const timetablesResult = await pool.query(
            'SELECT t.*, te.name FROM timetables t JOIN teachers te ON t.teacher_id = te.id WHERE t.day = $1 ORDER BY t.period_number, te.name',
            [day]
        );
        console.log(`Found ${timetablesResult.rows.length} timetable entries:`);
        timetablesResult.rows.forEach(tt => {
            console.log(`  - Period ${tt.period_number}: ${tt.name} - ${tt.class_name} (${tt.subject})`);
        });

        // 4. Check absent teachers
        console.log(`\n--- ABSENT TEACHERS ON ${testDate} ---`);
        const absentResult = await pool.query(
            `SELECT t.* FROM teachers t
             WHERE t.id IN (
                SELECT teacher_id FROM attendance 
                WHERE date = $1 AND status = 'Absent'
             )`,
            [testDate]
        );
        console.log(`Found ${absentResult.rows.length} absent teachers:`);
        absentResult.rows.forEach(t => {
            console.log(`  - ${t.name}`);
        });

        // 5. Check present teachers
        console.log(`\n--- PRESENT TEACHERS ON ${testDate} ---`);
        const presentResult = await pool.query(
            `SELECT t.* FROM teachers t
             WHERE t.id IN (
                SELECT teacher_id FROM attendance 
                WHERE date = $1 AND status = 'Present'
             )`,
            [testDate]
        );
        console.log(`Found ${presentResult.rows.length} present teachers:`);
        presentResult.rows.forEach(t => {
            console.log(`  - ${t.name}`);
        });

        // 6. If there are absent teachers, check available substitutes
        if (absentResult.rows.length > 0) {
            const absentTeacher = absentResult.rows[0];
            console.log(`\n--- CHECKING AVAILABLE SUBSTITUTES FOR ${absentTeacher.name} ---`);
            
            // Get their periods
            const periodsResult = await pool.query(
                'SELECT * FROM timetables WHERE teacher_id = $1 AND day = $2 ORDER BY period_number',
                [absentTeacher.id, day]
            );
            
            console.log(`${absentTeacher.name} has ${periodsResult.rows.length} periods on ${day}:`);
            periodsResult.rows.forEach(p => {
                console.log(`  - Period ${p.period_number}: ${p.class_name}`);
            });

            if (periodsResult.rows.length > 0) {
                const firstPeriod = periodsResult.rows[0];
                console.log(`\n--- CHECKING SUBSTITUTES FOR PERIOD ${firstPeriod.period_number} ---`);
                
                const substitutesResult = await pool.query(
                    `SELECT 
                        te.*,
                        COUNT(s.id) as current_sub_count
                     FROM teachers te
                     LEFT JOIN substitutions s ON s.substitute_teacher_id = te.id AND s.date = $1
                     WHERE 
                        te.id != $2 -- Not the absent teacher
                        AND te.id NOT IN (
                            SELECT teacher_id FROM timetables 
                            WHERE day = $3 AND period_number = $4
                        ) -- Has free period
                        AND te.id IN (
                            SELECT teacher_id FROM attendance 
                            WHERE date = $1 AND status = 'Present'
                        ) -- Is present
                        AND (
                            SELECT COUNT(*) FROM substitutions 
                            WHERE substitute_teacher_id = te.id AND date = $1
                        ) < te.max_substitution_limit -- Within limit
                     GROUP BY te.id
                     ORDER BY current_sub_count ASC, te.current_substitution_count ASC
                     LIMIT 1`,
                    [testDate, absentTeacher.id, day, firstPeriod.period_number]
                );

                console.log(`Found ${substitutesResult.rows.length} available substitutes`);
                substitutesResult.rows.forEach(s => {
                    console.log(`  - ${s.name} (Substitutions today: ${s.current_sub_count})`);
                });
            }
        }

        console.log('\n=== END DEBUG ===\n');
        process.exit(0);
    } catch (error) {
        console.error('Debug error:', error);
        process.exit(1);
    }
}

debugSubstitutions();
