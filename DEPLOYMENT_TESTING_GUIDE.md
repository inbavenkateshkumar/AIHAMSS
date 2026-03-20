# Timetable System - Deployment & Testing Guide

## Overview

This guide covers deploying the timetable system to production and comprehensive testing strategies.

---

## Pre-Deployment Checklist

### Code Review
- [ ] All files properly formatted
- [ ] No console.log() statements left (except errors)
- [ ] No hardcoded passwords or secrets
- [ ] Environment variables properly configured
- [ ] Error handling in place
- [ ] Comments updated

### Database
- [ ] Schema created successfully
- [ ] Indexes created
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Backup tested

### Testing
- [ ] Unit tests pass (if available)
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance verified
- [ ] Edge cases tested

### Documentation
- [ ] README up to date
- [ ] API documentation complete
- [ ] Setup instructions verified
- [ ] Troubleshooting guide ready

---

## Deployment Steps

### Step 1: Prepare Environment

```bash
# Create .env file (if not exists)
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teacher_substitution
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
EOF

# Verify .env is NOT in git
echo ".env" >> .gitignore
```

### Step 2: Install & Build

```bash
# Install dependencies
npm install

# Clean install (if needed)
rm -rf node_modules package-lock.json
npm install

# Verify no vulnerabilities
npm audit
npm audit fix  # Only if safe
```

### Step 3: Database Setup

```bash
# Create database (one-time)
createdb teacher_substitution

# Apply schema
psql -U postgres -d teacher_substitution -f database/schema.sql

# Verify tables created
psql -U postgres -d teacher_substitution -c "\dt"
```

### Step 4: Import Data

```bash
# Import timetables
node importTimetables.js

# Verify import
node validateTimetables.js
```

### Step 5: Run Tests

```bash
# Run comprehensive validation
node validateTimetables.js

# Check for errors
npm run lint  # If linter configured

# Run tests (if available)
npm test
```

### Step 6: Start Server

```bash
# Development
npm run dev

# Production
NODE_ENV=production npm start

# With PM2 (recommended for production)
pm2 start server.js --name "timetable-system"
pm2 save
pm2 startup
```

### Step 7: Verify System

```bash
# Check server is running
curl http://localhost:5000

# Check health endpoint
curl http://localhost:5000/api/health

# Check database connection
curl http://localhost:5000/api/test/db
```

---

## Testing Strategy

### Unit Tests (If Implemented)

```bash
npm test -- --testPathPattern="timetableUtils"
```

**Should test:**
- getFreePeriods() with various inputs
- getDaySchedule() returns correct format
- getTeachersFreeDuring() finds correct teachers
- Day mapping conversions
- Period mapping conversions

### Integration Tests

#### Test 1: Import → Validate → Query Flow

```bash
#!/bin/bash
echo "Testing import flow..."

# 1. Clear timetables
psql -U postgres -d teacher_substitution << SQL
DELETE FROM timetables;
SQL

# 2. Import
echo "Importing..."
node importTimetables.js > import.log 2>&1

# 3. Validate
echo "Validating..."
node validateTimetables.js > validate.log 2>&1

# 4. Check results
ENTRIES=$(psql -U postgres -d teacher_substitution -t -c "SELECT COUNT(*) FROM timetables;")
echo "Timetable entries: $ENTRIES"

if [ "$ENTRIES" -eq 1100 ]; then
    echo "✓ Import test PASSED"
else
    echo "✗ Import test FAILED"
fi
```

#### Test 2: API Endpoint Tests

```bash
#!/bin/bash

echo "Testing API endpoints..."

BASE_URL="http://localhost:5000"

# Test 1: Get teacher timetable
echo "Test 1: GET /api/timetables/1"
curl -s -X GET "$BASE_URL/api/timetables/1" | jq .

# Test 2: Get free periods
echo "Test 2: GET /api/timetables/1/free-periods/Monday"
curl -s -X GET "$BASE_URL/api/timetables/1/free-periods/Monday" | jq .

# Test 3: Get class timetable
echo "Test 3: GET /api/timetables/class/6A"
curl -s -X GET "$BASE_URL/api/timetables/class/6A" | jq .
```

#### Test 3: Substitution Assignment

```javascript
/**
 * test/substitution.test.js
 * Integration test for substitution assignment
 */

const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');

describe('Substitution Assignment', () => {
    let token;

    beforeAll(async () => {
        // Create test user and get token
        token = await getAuthToken('admin', 'password123');
    });

    test('Should assign substitutes for absent teacher', async () => {
        // 1. Mark teacher absent
        await request(app)
            .post('/api/attendance/mark')
            .set('Authorization', `Bearer ${token}`)
            .send({
                teacher_id: 1,
                date: '2024-01-15',
                status: 'Absent'
            });

        // 2. Run assignment
        const response = await request(app)
            .post('/api/substitutions/assign')
            .set('Authorization', `Bearer ${token}`)
            .send({
                date: '2024-01-15',
                day: 'Monday'
            });

        // 3. Verify response
        expect(response.status).toBe(200);
        expect(response.body.substitutions).toBeDefined();
        expect(response.body.substitutions.length).toBeGreaterThan(0);

        // 4. Verify database
        const result = await pool.query(
            'SELECT * FROM substitutions WHERE date = $1',
            ['2024-01-15']
        );
        expect(result.rows.length).toBeGreaterThan(0);
    });
});
```

### Manual Testing

#### Test Case 1: View Dashboard

1. Open http://localhost:5000
2. Login with admin/password123
3. Verify:
   - [ ] Dashboard loads
   - [ ] Teachers listed
   - [ ] Timetables visible
   - [ ] No console errors

#### Test Case 2: Mark Attendance

1. Go to Attendance page
2. Select a date
3. Mark some teachers Present
4. Mark one teacher Absent
5. Verify:
   - [ ] Data saved
   - [ ] UI updates
   - [ ] No errors

#### Test Case 3: Assign Substitutions

1. Go to Substitutions page (Admin only)
2. Click "Assign"
3. Select date with absent teacher
4. Verify:
   - [ ] Assignments created
   - [ ] Correct classes assigned
   - [ ] Correct periods assigned
   - [ ] Notifications sent
   - [ ] Fair distribution

#### Test Case 4: View Teacher Timetable

1. Go to Teachers page
2. Click on a teacher
3. Verify:
   - [ ] 5 days displayed
   - [ ] 8 periods per day
   - [ ] Classes shown correctly
   - [ ] Free periods marked
   - [ ] No duplicates

#### Test Case 5: Export CSV

1. From teacher details
2. Click "Download Schedule"
3. Verify:
   - [ ] CSV downloads
   - [ ] File is readable
   - [ ] Data matches display
   - [ ] Proper formatting

### Performance Testing

#### Load Test

```bash
#!/bin/bash
# Simple load test using Apache Bench

echo "Running load test..."

# Test 1: API endpoint
ab -n 100 -c 10 http://localhost:5000/api/timetables/1

# Test 2: Database query
for i in {1..50}; do
    curl -s http://localhost:5000/api/timetables/$((i % 29 + 1)) > /dev/null
done

echo "Load test complete"
```

#### Database Performance

```sql
-- Check query performance
EXPLAIN ANALYZE
SELECT teacher_id FROM teachers 
WHERE id NOT IN (
    SELECT teacher_id FROM timetables 
    WHERE day = 'Monday' AND period_number = 2
);

-- Should show: Seq Scan or Index Scan, low cost
```

### Error Handling Tests

#### Test 1: Invalid Teacher ID

```bash
curl -s http://localhost:5000/api/timetables/99999 | jq .
# Should return: 404 or empty result
```

#### Test 2: Invalid Day

```bash
curl -s http://localhost:5000/api/timetables/1/free-periods/InvalidDay | jq .
# Should return: 400 or error
```

#### Test 3: Database Connection Failure

1. Stop PostgreSQL
2. Try to load any page
3. Verify:
   - [ ] Graceful error message
   - [ ] No server crash
   - [ ] Proper HTTP status code

#### Test 4: Missing Environment Variables

1. Remove JWT_SECRET from .env
2. Start server
3. Verify:
   - [ ] Clear error message
   - [ ] Server doesn't crash
   - [ ] Instructions to fix

---

## Production Deployment

### Option 1: Traditional Server (Linux/Ubuntu)

```bash
# 1. Update system
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Clone repository
git clone <repo_url>
cd teacher_substitution

# 5. Install dependencies
npm install --production

# 6. Configure environment
nano .env  # Set all variables

# 7. Setup database
psql -U postgres -c "CREATE DATABASE teacher_substitution;"
psql -U postgres -d teacher_substitution -f database/schema.sql

# 8. Import data
node importTimetables.js

# 9. Start with PM2
pm2 start server.js --name "timetable"
pm2 save
pm2 startup

# 10. Configure Nginx (reverse proxy)
sudo nano /etc/nginx/sites-available/timetable
# Add upstream and server blocks
sudo systemctl restart nginx
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t timetable-system .
docker run -d \
  -p 5000:5000 \
  -e DB_HOST=db \
  -e DB_NAME=teacher_substitution \
  --name timetable \
  timetable-system
```

### Option 3: Cloud Platforms

#### Heroku/Render

```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

#### AWS

1. EC2 instance (Ubuntu)
2. RDS for PostgreSQL
3. ALB for load balancing
4. CloudWatch for monitoring

#### DigitalOcean App Platform

1. Connect GitHub repo
2. Set environment variables
3. Deploy (automatic on push)

---

## Monitoring & Maintenance

### Logging

```javascript
// Add to server.js
const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Log to file
const logStream = fs.createWriteStream(
    path.join(logsDir, `app-${Date.now()}.log`)
);

app.use((req, res, next) => {
    logStream.write(
        `${new Date().toISOString()} ${req.method} ${req.url}\n`
    );
    next();
});
```

### Performance Monitoring

```javascript
// Add metrics endpoint
app.get('/api/metrics', (req, res) => {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    
    res.json({
        uptime,
        memory: {
            used: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
        }
    });
});
```

### Health Checks

```javascript
app.get('/api/health', async (req, res) => {
    try {
        // Check database
        const result = await pool.query('SELECT 1');
        
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date()
        });
    } catch (err) {
        res.status(500).json({
            status: 'unhealthy',
            error: err.message
        });
    }
});
```

### Backup Strategy

```bash
#!/bin/bash
# Backup database daily

BACKUP_DIR="/var/backups/timetable"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# PostgreSQL backup
pg_dump -U postgres teacher_substitution | gzip > \
    $BACKUP_DIR/timetable_$DATE.sql.gz

# JSON backup
cp data/teachers.json $BACKUP_DIR/teachers_$DATE.json

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/timetable_$DATE.sql.gz"
```

### Update Procedure

```bash
#!/bin/bash
# Safe update procedure

# 1. Backup database
./backup.sh

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
npm install

# 4. Test import
node importTimetables.js --dry-run

# 5. Validate data
node validateTimetables.js

# 6. Restart service
pm2 restart timetable

# 7. Verify health
curl http://localhost:5000/api/health
```

---

## Rollback Procedure

```bash
#!/bin/bash

echo "Initiating rollback..."

# 1. Stop current version
pm2 stop timetable

# 2. Restore previous code
git revert HEAD
npm install

# 3. Restore database from backup
BACKUP_FILE=$1  # Pass backup file as argument
gunzip -c $BACKUP_FILE | psql -U postgres teacher_substitution

# 4. Start previous version
pm2 start timetable

# 5. Verify
curl http://localhost:5000/api/health

echo "Rollback completed"
```

---

## Troubleshooting

### Issue: Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Issue: Database Connection Failed

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U postgres -d teacher_substitution -c "SELECT 1;"

# Check .env file
cat .env | grep DB_
```

### Issue: High Memory Usage

```bash
# Check memory
free -h

# Profile application
node --inspect server.js
# Then open chrome://inspect

# Check for leaks
npm install -g clinic
clinic doctor -- node server.js
```

### Issue: Slow Queries

```bash
# Enable query logging
psql -U postgres -d teacher_substitution << SQL
SET log_min_duration_statement = 1000;  -- Log queries > 1s
SQL

# Check logs
tail -f /var/log/postgresql/postgresql.log
```

---

## Success Checklist

### After Deployment
- [ ] Server running without errors
- [ ] Database connected
- [ ] Timetables loaded (1100+ entries)
- [ ] API endpoints responding
- [ ] UI accessible
- [ ] Authentication working
- [ ] Substitution algorithm functional
- [ ] Notifications sending
- [ ] Backups scheduled
- [ ] Monitoring active

### Performance Baseline
- [ ] Page load < 2 seconds
- [ ] API response < 200ms
- [ ] Database query < 50ms
- [ ] Memory stable < 200MB
- [ ] No memory leaks (24h test)

### User Testing
- [ ] Teachers can view timetable
- [ ] Admin can mark attendance
- [ ] Substitutions assign correctly
- [ ] Notifications deliver
- [ ] Reports generate
- [ ] No UI errors
- [ ] Mobile responsive

---

## Document Checklist

- [ ] README.md updated
- [ ] API documentation complete
- [ ] Setup instructions verified
- [ ] Deployment guide tested
- [ ] Troubleshooting guide complete
- [ ] Version documented (git tag)

---

## Go-Live Checklist

- [ ] All testing complete
- [ ] Backups verified
- [ ] Support documentation ready
- [ ] Team trained
- [ ] Monitoring alerts configured
- [ ] Incident response plan ready
- [ ] Rollback procedure tested
- [ ] Stakeholders notified

**System Ready for Production! 🚀**
