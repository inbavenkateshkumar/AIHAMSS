# Timetable System Integration Guide

## Overview

The timetable dataset has been successfully integrated into the Teacher Substitution Management System. This guide explains the structure, setup, and usage of the timetable system.

## Data Structure

### Source Data Format
The timetable JSON contains 29 teachers with their weekly schedules:

```json
{
  "id": 1,
  "name": "Meenatchi",
  "schedule": {
    "Mon": ["6A", "9B", "11B", null, null, "6A", null, null],
    "Tue": ["6A", "11B", null, "11B", "11A", "11A", null, null],
    ...
  }
}
```

**Key Points:**
- **Period Mapping**: Array index 0 = Period 1, index 1 = Period 2, ... index 7 = Period 8
- **Days**: Mon→Monday, Tue→Tuesday, Wed→Wednesday, Thu→Thursday, Fri→Friday
- **Free Periods**: `null` values indicate free periods where substitutes can be assigned
- **Class Codes**: Classes are encoded as class_name (e.g., "6A", "12C")

## Database Schema

### Timetables Table
```sql
CREATE TABLE timetables (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL,
    day VARCHAR(20) NOT NULL,              -- Monday-Friday
    period_number INTEGER NOT NULL,        -- 1-8
    class_name VARCHAR(50) NOT NULL,       -- e.g., "6A", "11B"
    subject VARCHAR(100) NOT NULL,         -- Subject (currently "General")
    UNIQUE(teacher_id, day, period_number)
);
```

## Setup & Import

### 1. Import Timetables to Database

```bash
# Ensure database is running and schema is created
npm run setup

# Import timetables from JSON
node importTimetables.js
```

**Output:**
```
📚 Starting timetable import...
✓ Loaded 29 teachers from JSON
✓ Import Complete!
   Total entries inserted: 1100
   Free periods skipped: 60
```

### 2. Validate Imported Data

```bash
node validateTimetables.js
```

**Output includes:**
- Teacher coverage statistics
- Distribution by day and period
- Free period analysis
- Teacher workload analysis
- Class scheduling analysis
- Data quality checks

## Usage in System

### Core Functions

#### 1. Find Free Periods
Used in substitution planning to identify available teachers:

```javascript
const { getFreePeriods } = require('./utils/timetableUtils');

// Get all free periods for a teacher on a specific day
const freePeriods = await getFreePeriods(teacherId, 'Monday');
// Returns: [2, 4, 5] (periods where teacher is free)
```

#### 2. Get Day Schedule
Retrieve a teacher's complete schedule for a day:

```javascript
const { getDaySchedule } = require('./utils/timetableUtils');

const schedule = await getDaySchedule(1, 'Monday');
// Returns: {
//   1: "6A",
//   2: "9B",
//   3: "11B",
//   4: null,
//   5: null,
//   6: "6A",
//   7: null,
//   8: null
// }
```

#### 3. Find Teachers Available During Period
For substitution assignment:

```javascript
const { getTeachersFreeDuring } = require('./utils/timetableUtils');

const availableTeachers = await getTeachersFreeDuring('Monday', 3);
// Returns: [2, 5, 7, 9, ...] (teacher IDs free during period 3 on Monday)
```

#### 4. Get Class Timetable
View which teachers teach a class:

```javascript
const { getClassTimetable } = require('./utils/timetableUtils');

const classTT = await getClassTimetable('6A', 'Monday');
// Returns timetable entries for class 6A on Monday
```

#### 5. Get Weekly Schedule
Complete weekly timetable for a teacher:

```javascript
const { getWeeklySchedule } = require('./utils/timetableUtils');

const weekly = await getWeeklySchedule(1);
// Returns full week schedule with all 5 days
```

## Substitution Algorithm Integration

The substitution assignment algorithm uses timetables for:

### 1. Free Period Detection
```sql
-- Find teachers with free periods
WHERE teacher_id NOT IN (
    SELECT teacher_id FROM timetables 
    WHERE day = $1 AND period_number = $2
)
```

### 2. Multiple Period Assignments
When a teacher is absent, the system:
1. Finds all their periods for that day
2. For each period, assigns the most available substitute
3. Rotates assignments for fairness

### 3. Class-Period Mapping
Ensures correct class is assigned to substitute:
```
Absent Teacher: Period 3 → Class 11B
Substitute: Gets assignment for Class 11B (not just any class)
```

## Frontend Integration

### Displaying Teacher Timetables
Endpoint: `GET /api/timetables/:teacherId`

```javascript
// Fetch from frontend
const response = await fetch('/api/timetables/1');
const data = await response.json();

// Render timetable
renderTimetable(data.schedule); // Full weekly schedule
```

### Free Period Availability
When assigning substitutes (admin view):
```javascript
// Shows which teachers are free during a period
const freeTeachers = await getTeachersFreeDuring(day, period);
```

### Class-wise Timetable
For parent/student portal:
```javascript
// Show who teaches a specific class
const classTT = await getClassTimetable('6A', 'Monday');
```

## Data Statistics

### Dataset Overview
- **Teachers**: 29
- **Total Classes/Periods**: ~1100
- **Free Periods**: ~60 per week (average 2.07 per teacher)
- **Classes per Teacher**: Average 37.9 periods/week
- **Days Taught**: Most teachers teach all 5 days

### Busiest Classes (>8 periods/week)
- Class 12C: 10+ periods (taught by multiple teachers)
- Classes 11A, 11B: 8+ periods each
- Class 6A: 9 periods

### Most Loaded Teachers
Teachers with most teaching periods (closest to unavailable):
- Banu, Arul Thayalan: ~39 periods/week (97.5% utilization)
- Most other teachers: 30-38 periods/week

### Highest Free Periods
Teachers with most availability for substitutions:
- Sr. Maggie: 24 free periods (60%)
- Venkatachalam: 12 free periods (30%)

## Query Examples

### 1. Find All Free Teachers for a Period
```sql
SELECT te.id, te.name
FROM teachers te
WHERE te.id NOT IN (
    SELECT teacher_id FROM timetables 
    WHERE day = 'Monday' AND period_number = 2
)
ORDER BY te.current_substitution_count ASC
LIMIT 5;
```

### 2. Check Specific Teacher Schedule
```sql
SELECT period_number, class_name, subject
FROM timetables
WHERE teacher_id = 1 AND day = 'Monday'
ORDER BY period_number;
```

### 3. Class Distribution
```sql
SELECT class_name, COUNT(*) as periods, 
       COUNT(DISTINCT teacher_id) as teachers
FROM timetables
GROUP BY class_name
ORDER BY periods DESC;
```

### 4. Teacher Load Analysis
```sql
SELECT te.name, COUNT(*) as total_periods,
       COUNT(DISTINCT day) as days_teaching,
       (40 - COUNT(*)) as free_periods
FROM teachers te
LEFT JOIN timetables t ON te.id = t.teacher_id
GROUP BY te.id, te.name
ORDER BY total_periods DESC;
```

## API Endpoints

### Get Teacher Timetable
```
GET /api/timetables/:teacherId
Response: {
  teacherId: 1,
  teacherName: "Meenatchi",
  schedule: { Monday: [...], Tuesday: [...], ... }
}
```

### Get Class Timetable
```
GET /api/timetables/class/:classCode/:day
Response: {
  classCode: "6A",
  day: "Monday",
  timetable: [{period: 1, teacher: "Meenatchi", subject: "General"}]
}
```

## Troubleshooting

### Issue: "No substitute available"
**Cause**: All free teachers have reached their substitution limit
**Solution**: 
- Increase `max_substitution_limit` in teachers table
- Check attendance marks—ensure teachers are marked Present
- Verify timetable data is correct for that day/period

### Issue: Free periods not detected correctly
**Cause**: Timetable data missing or incorrect day names
**Solution**:
```bash
node validateTimetables.js  # Check data integrity
```

### Issue: Wrong class assigned to substitute
**Cause**: Class names not matching in timetables and substitutions
**Solution**: Ensure class codes are consistent (e.g., "6A" not "6a")

## Maintenance

### Updating Teacher Schedule
```javascript
// Add/update timetable entry
await pool.query(
  `INSERT INTO timetables (teacher_id, day, period_number, class_name, subject)
   VALUES ($1, $2, $3, $4, $5)
   ON CONFLICT (teacher_id, day, period_number) 
   DO UPDATE SET class_name = $4, subject = $5`,
  [teacherId, day, period, className, subject]
);
```

### Remove Timetable Entry
```javascript
// Mark period as free
await pool.query(
  `DELETE FROM timetables 
   WHERE teacher_id = $1 AND day = $2 AND period_number = $3`,
  [teacherId, day, period]
);
```

### Bulk Update Classes
```sql
UPDATE timetables SET subject = 'Mathematics' 
WHERE class_name LIKE '6%';
```

## Performance Optimization

### Indexed Queries
The timetables table includes indexes on:
- `teacher_id, day` - Fast schedule lookup
- `day, period_number` - Fast free period detection

For high-volume queries, consider adding:
```sql
CREATE INDEX idx_timetables_class ON timetables(class_name);
CREATE INDEX idx_timetables_availability ON timetables(day, period_number, teacher_id);
```

## Related Documentation

- [SUBSTITUTION_LOGIC.md](SUBSTITUTION_LOGIC.md) - Detailed algorithm explanation
- [database/schema.sql](database/schema.sql) - Complete database schema
- [controllers/substitutionController.js](controllers/substitutionController.js) - Substitution logic implementation
- [utils/timetableUtils.js](utils/timetableUtils.js) - Timetable utility functions

## Questions & Support

For specific questions about:
- **Data format**: See "Data Structure" section
- **Database schema**: See database/schema.sql
- **Queries**: See "Query Examples" section
- **Integration**: See "API Endpoints" section
