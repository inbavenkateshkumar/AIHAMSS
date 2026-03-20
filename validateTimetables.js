/**
 * Timetable Data Validation & Analysis
 * 
 * Tests and analyzes the imported timetable data:
 * - Data integrity checks
 * - Free period detection
 * - Class distribution analysis
 * - Teacher workload analysis
 */

const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runValidation() {
    try {
        console.log('🔍 Starting Timetable Validation & Analysis\n');
        console.log('═'.repeat(60));

        // 1. Load source JSON
        console.log('\n1️⃣  Source Data Verification');
        console.log('─'.repeat(60));
        
        const filePath = path.join(__dirname, 'data', 'teachers.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const sourceData = JSON.parse(fileContent);

        console.log(`✓ JSON file loaded: ${sourceData.length} teachers`);
        
        // Calculate total classes in JSON
        let jsonTotalClasses = 0;
        let jsonTotalFreePeriods = 0;
        
        sourceData.forEach(teacher => {
            Object.values(teacher.schedule).forEach(day => {
                day.forEach(period => {
                    if (period === null) {
                        jsonTotalFreePeriods++;
                    } else {
                        jsonTotalClasses++;
                    }
                });
            });
        });
        
        console.log(`✓ Total periods in JSON: ${sourceData.length * 5 * 8} (29 teachers × 5 days × 8 periods)`);
        console.log(`✓ Actual classes: ${jsonTotalClasses}`);
        console.log(`✓ Free periods: ${jsonTotalFreePeriods}`);

        // 2. Database integrity
        console.log('\n2️⃣  Database Integrity Check');
        console.log('─'.repeat(60));

        const dbTeachers = await pool.query('SELECT COUNT(*) as count FROM teachers');
        const dbTimetables = await pool.query('SELECT COUNT(*) as count FROM timetables');
        
        console.log(`✓ Teachers in database: ${dbTeachers.rows[0].count}`);
        console.log(`✓ Timetable entries in database: ${dbTimetables.rows[0].count}`);
        
        // Verify count matches
        if (dbTimetables.rows[0].count === jsonTotalClasses) {
            console.log(`✅ MATCH: Database entries match JSON classes`);
        } else {
            console.log(`⚠️  MISMATCH: Expected ${jsonTotalClasses}, found ${dbTimetables.rows[0].count}`);
        }

        // 3. Teacher coverage
        console.log('\n3️⃣  Teacher Coverage');
        console.log('─'.repeat(60));

        const teachersWithSchedules = await pool.query(`
            SELECT COUNT(DISTINCT teacher_id) as count FROM timetables
        `);
        console.log(`✓ Teachers with schedules: ${teachersWithSchedules.rows[0].count}/${sourceData.length}`);

        // Teachers without schedules
        const teachersNoSchedule = await pool.query(`
            SELECT t.id, t.name 
            FROM teachers t
            LEFT JOIN timetables tt ON t.id = tt.teacher_id
            WHERE tt.id IS NULL
            ORDER BY t.id
        `);
        
        if (teachersNoSchedule.rows.length > 0) {
            console.log(`⚠️  Teachers without schedule entries:`);
            teachersNoSchedule.rows.forEach(t => console.log(`   - ${t.name} (ID: ${t.id})`));
        }

        // 4. Day distribution
        console.log('\n4️⃣  Schedule Distribution by Day');
        console.log('─'.repeat(60));

        const dayDistribution = await pool.query(`
            SELECT day, COUNT(*) as classes
            FROM timetables
            GROUP BY day
            ORDER BY 
                CASE day 
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                END
        `);

        dayDistribution.rows.forEach(row => {
            console.log(`✓ ${row.day}: ${row.classes} classes`);
        });

        // 5. Period distribution
        console.log('\n5️⃣  Schedule Distribution by Period');
        console.log('─'.repeat(60));

        const periodDistribution = await pool.query(`
            SELECT period_number, COUNT(*) as classes
            FROM timetables
            GROUP BY period_number
            ORDER BY period_number
        `);

        periodDistribution.rows.forEach(row => {
            console.log(`✓ Period ${row.period_number}: ${row.classes} classes`);
        });

        // 6. Free period analysis
        console.log('\n6️⃣  Free Period Analysis');
        console.log('─'.repeat(60));

        const freePeriodAnalysis = await pool.query(`
            SELECT te.id, te.name, COUNT(*) as free_periods
            FROM teachers te
            CROSS JOIN (
                SELECT DISTINCT day FROM (VALUES 
                    ('Monday'), ('Tuesday'), ('Wednesday'), ('Thursday'), ('Friday')
                ) AS days(day)
            ) days
            CROSS JOIN (
                SELECT generate_series(1, 8) as period_number
            ) periods
            LEFT JOIN timetables t ON te.id = t.teacher_id 
                AND t.day = days.day 
                AND t.period_number = periods.period_number
            WHERE t.id IS NULL
            GROUP BY te.id, te.name
            ORDER BY free_periods DESC
            LIMIT 10
        `);

        console.log(`✓ Top 10 teachers with most free periods:`);
        freePeriodAnalysis.rows.forEach(row => {
            const percentage = ((row.free_periods / 40) * 100).toFixed(1);
            console.log(`   ${row.name}: ${row.free_periods} free periods (${percentage}%)`);
        });

        // 7. Teacher workload
        console.log('\n7️⃣  Teacher Workload Analysis');
        console.log('─'.repeat(60));

        const workloadAnalysis = await pool.query(`
            SELECT te.id, te.name, COUNT(*) as total_classes, 
                   COUNT(DISTINCT t.day) as days_teaching
            FROM teachers te
            LEFT JOIN timetables t ON te.id = t.teacher_id
            GROUP BY te.id, te.name
            ORDER BY total_classes DESC
            LIMIT 10
        `);

        console.log(`✓ Top 10 teachers by class load:`);
        workloadAnalysis.rows.forEach(row => {
            console.log(`   ${row.name}: ${row.total_classes} classes (${row.days_teaching} days)`);
        });

        // 8. Class analysis
        console.log('\n8️⃣  Class Distribution');
        console.log('─'.repeat(60));

        const classAnalysis = await pool.query(`
            SELECT class_name, COUNT(*) as total_periods, 
                   COUNT(DISTINCT teacher_id) as unique_teachers,
                   COUNT(DISTINCT day) as days_taught
            FROM timetables
            GROUP BY class_name
            ORDER BY total_periods DESC
            LIMIT 15
        `);

        console.log(`✓ Top 15 most scheduled classes:`);
        classAnalysis.rows.forEach(row => {
            console.log(`   ${row.class_name}: ${row.total_periods} periods, ${row.unique_teachers} teachers, ${row.days_taught} days`);
        });

        // 9. Data quality checks
        console.log('\n9️⃣  Data Quality Checks');
        console.log('─'.repeat(60));

        // Check for duplicate entries
        const duplicates = await pool.query(`
            SELECT teacher_id, day, period_number, COUNT(*) as count
            FROM timetables
            GROUP BY teacher_id, day, period_number
            HAVING COUNT(*) > 1
        `);

        if (duplicates.rows.length === 0) {
            console.log(`✅ No duplicate timetable entries`);
        } else {
            console.log(`⚠️  Found ${duplicates.rows.length} duplicate entries`);
        }

        // Check for invalid period numbers
        const invalidPeriods = await pool.query(`
            SELECT COUNT(*) as count FROM timetables
            WHERE period_number < 1 OR period_number > 8
        `);

        if (parseInt(invalidPeriods.rows[0].count) === 0) {
            console.log(`✅ All period numbers valid (1-8)`);
        } else {
            console.log(`⚠️  Found ${invalidPeriods.rows[0].count} invalid period numbers`);
        }

        // Check for invalid day names
        const invalidDays = await pool.query(`
            SELECT COUNT(*) as count FROM timetables
            WHERE day NOT IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')
        `);

        if (parseInt(invalidDays.rows[0].count) === 0) {
            console.log(`✅ All day names valid`);
        } else {
            console.log(`⚠️  Found ${invalidDays.rows[0].count} invalid day names`);
        }

        // 10. Sample timetable display
        console.log('\n🔟 Sample Teacher Timetable (Meenatchi)');
        console.log('─'.repeat(60));

        const sample = await pool.query(`
            SELECT day, period_number, class_name
            FROM timetables
            WHERE teacher_id = 1
            ORDER BY 
                CASE day 
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                END,
                period_number
        `);

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        days.forEach(day => {
            const dayClasses = sample.rows.filter(r => r.day === day);
            const schedule = Array(8).fill('FREE');
            dayClasses.forEach(c => {
                schedule[c.period_number - 1] = c.class_name;
            });
            console.log(`${day}: ${schedule.map((c, i) => `P${i+1}:${c}`).join(' | ')}`);
        });

        // Summary
        console.log('\n' + '═'.repeat(60));
        console.log('✅ VALIDATION COMPLETE');
        console.log('═'.repeat(60));

        console.log(`\n📊 Summary:`);
        console.log(`   • Teachers: ${sourceData.length}`);
        console.log(`   • Total timetable entries: ${dbTimetables.rows[0].count}`);
        console.log(`   • Average classes per teacher: ${(dbTimetables.rows[0].count / sourceData.length).toFixed(2)}`);
        console.log(`   • Total free periods: ${sourceData.length * 40 - dbTimetables.rows[0].count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Validation error:', error);
        process.exit(1);
    }
}

// Run validation
runValidation();
