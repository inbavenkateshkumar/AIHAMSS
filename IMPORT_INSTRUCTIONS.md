# 📥 Import New Teacher Data - Instructions

## Quick Import (3 Steps)

### Step 1: Make sure you're in the project folder

```bash
cd "C:\Users\Thirumoorthy\Desktop\timetable"
```

### Step 2: Run the import script

```bash
npm run import
```

**OR directly:**
```bash
node import-teachers.js
```

### Step 3: Wait for completion

The script will:
- ✅ Delete all old teachers
- ✅ Delete all old timetables
- ✅ Import 29 new teachers
- ✅ Import all their schedules

---

## What Gets Imported

- **29 Teachers** with their names
- **All timetables** for Monday-Friday
- **8 periods per day** (Period 1-8)
- **Class assignments** (like 6A, 9B, 11C, etc.)

---

## Expected Output

```
🔄 Starting import process...

📋 Step 1: Clearing old timetables...
✅ Old timetables deleted

👥 Step 2: Clearing old teachers...
✅ Old teachers deleted

➕ Step 3: Inserting new teachers and timetables...
✅ Imported: Meenatchi (ID: 1)
✅ Imported: G. Bhuvana (ID: 2)
✅ Imported: V. Valli (ID: 3)
... (and so on for all 29 teachers)

🎉 Import completed successfully!
📊 Total teachers imported: 29
📅 Total timetable entries: [number]
```

---

## ⚠️ Important Notes

1. **This will DELETE all existing teachers and timetables**
2. **Make sure your database is connected** (check `.env` file)
3. **Backup your data first** if you have important existing data

---

## Troubleshooting

### "Cannot find module"
- Make sure you're in the project folder
- Run `npm install` first

### Database connection error
- Check your `.env` file has correct database credentials
- Make sure PostgreSQL is running

### Import fails
- Check database connection
- Verify database schema is created (`database/schema.sql`)
- Check console for specific error messages

---

## After Import

1. **Verify in database:**
   ```sql
   SELECT COUNT(*) FROM teachers;  -- Should be 29
   SELECT COUNT(*) FROM timetables; -- Should be many entries
   ```

2. **Check in application:**
   - Go to Teachers page
   - Should see all 29 teachers
   - Go to Timetables page
   - Should see all schedules

---

## Teachers Being Imported

1. Meenatchi
2. G. Bhuvana
3. V. Valli
4. Kumutha
5. Valarmathi
6. Nandhini
7. Jeevitha
8. Deepa
9. Madheshwari
10. Mangalpriya
11. P. Subathra
12. Santhi
13. Bhuvaneshwari
14. Gokul
15. Subaitha
16. K. Subathra
17. Baby
18. Arul Thayalan
19. Parthasarathi
20. Venkatachalam
21. Banu
22. Latha
23. Nithya
24. Sathya
25. Mary Fathima
26. PT Sir
27. Manjula
28. Anuradha
29. Sr. Maggie

---

**Ready to import? Run: `npm run import`** 🚀