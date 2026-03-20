# Substitution Logic Explanation

## Overview

The substitution algorithm automatically assigns substitute teachers when a teacher is absent, ensuring fair workload distribution and preventing teacher overload.

## Step-by-Step Algorithm

### Step 1: Identify Absent Teachers

When attendance is submitted for a date:
- Teachers marked as "Present" are stored in the attendance table
- Teachers NOT marked as "Present" are treated as "Absent"
- The system queries: `SELECT teachers WHERE NOT IN (SELECT teacher_id FROM attendance WHERE status='Present' AND date=X)`

### Step 2: Get Absent Teacher's Schedule

For each absent teacher found:
- Query the timetables table: `SELECT * FROM timetables WHERE teacher_id = X AND day = Y`
- This returns all periods the absent teacher was scheduled to teach

### Step 3: For Each Period, Find Available Substitutes

For each period the absent teacher was supposed to teach:

**Criteria for a suitable substitute:**

1. **Must be Present**: 
   ```sql
   teacher_id IN (SELECT teacher_id FROM attendance WHERE status='Present' AND date=X)
   ```

2. **Must have Free Period**:
   ```sql
   teacher_id NOT IN (
       SELECT teacher_id FROM timetables 
       WHERE day = Y AND period_number = Z
   )
   ```

3. **Must not exceed substitution limit**:
   ```sql
   (SELECT COUNT(*) FROM substitutions 
    WHERE substitute_teacher_id = teacher_id AND date = X) 
    < max_substitution_limit
   ```

### Step 4: Select Best Substitute

Among all available substitutes, select the one with:
- **Lowest current substitution count** for the day (fair distribution)
- If tied, select by lowest `current_substitution_count` (overall fairness)

**SQL Query:**
```sql
SELECT teachers.*, COUNT(substitutions.id) as current_sub_count
FROM teachers
LEFT JOIN substitutions ON substitutions.substitute_teacher_id = teachers.id AND substitutions.date = X
WHERE 
    teachers.id != absent_teacher_id
    AND teachers.id NOT IN (SELECT teacher_id FROM timetables WHERE day = Y AND period_number = Z)
    AND teachers.id IN (SELECT teacher_id FROM attendance WHERE status='Present' AND date = X)
    AND (SELECT COUNT(*) FROM substitutions WHERE substitute_teacher_id = teachers.id AND date = X) < max_substitution_limit
GROUP BY teachers.id
ORDER BY current_sub_count ASC, teachers.current_substitution_count ASC
LIMIT 1
```

### Step 5: Assign and Notify

Once a substitute is selected:
1. Create substitution record in database
2. Increment substitute teacher's `current_substitution_count`
3. Create notification for the substitute teacher
4. Move to next period

### Step 6: Handle No Substitute Available

If no suitable substitute is found for a period:
- Record is created but marked as "No substitute available"
- System continues to next period
- Administrator can manually assign later if needed

## Example Scenario

**Date**: Monday, 2024-01-15
**Day**: Monday
**Absent Teacher**: Dr. Rajesh Kumar (Mathematics)

**Dr. Rajesh's Monday Schedule:**
- Period 1: Class 10A - Mathematics
- Period 3: Class 9B - Mathematics  
- Period 5: Class 11A - Mathematics

**Available Teachers (Present):**
- Mr. Amit Singh (Science) - Free at Period 1, 3, 7, 8
- Ms. Anjali Patel (Social Studies) - Free at Period 2, 4, 6
- Dr. Vikram Reddy (Physics) - Free at Period 1, 2, 5, 8
- Mrs. Meera Nair (Chemistry) - Free at Period 1, 2, 3, 8

**Assignment Process:**

1. **Period 1** (Class 10A - Mathematics):
   - Available: Amit (0 subs), Vikram (0 subs), Meera (0 subs)
   - Select: Amit (first alphabetically if count equal)
   - Assign: Amit → Class 10A, Period 1
   - Amit's count: 1

2. **Period 3** (Class 9B - Mathematics):
   - Available: Amit (1 sub), Meera (0 subs)
   - Select: Meera (lower count)
   - Assign: Meera → Class 9B, Period 3
   - Meera's count: 1

3. **Period 5** (Class 11A - Mathematics):
   - Available: Vikram (0 subs)
   - Select: Vikram
   - Assign: Vikram → Class 11A, Period 5
   - Vikram's count: 1

**Result**: Fair distribution - each teacher gets 1 substitution!

## Fairness Mechanism

The algorithm ensures fairness through:

1. **Daily Distribution**: Counts substitutions per day to avoid overloading
2. **Limit Enforcement**: Respects `max_substitution_limit` per teacher
3. **Load Balancing**: Always selects teacher with fewest current assignments
4. **Automatic Rotation**: If multiple teachers have same count, rotates selection

## Edge Cases Handled

1. **Multiple Absent Teachers**: Processes each absent teacher sequentially
2. **No Available Substitutes**: Records period as unassigned, continues
3. **All Teachers at Limit**: Skips assignment, logs warning
4. **Concurrent Periods**: Each period is handled independently
5. **Same Teacher Multiple Absences**: Handles correctly per period basis

## Performance Considerations

- Uses database indexes on `date`, `day`, `period_number` for fast queries
- Transactions ensure data consistency
- Batch processing for multiple absences
- Efficient JOINs minimize database round trips

## Future Enhancements

Possible improvements:
- Subject matching (prefer same-subject teachers)
- Preference system (teacher preferences)
- Workload history tracking
- Automatic notifications via email/SMS
- Conflict detection and resolution