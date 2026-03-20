# Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up PostgreSQL

1. Make sure PostgreSQL is installed and running
2. Create a new database:

```sql
CREATE DATABASE teacher_substitution;
```

3. Run the schema:

```bash
psql -U postgres -d teacher_substitution -f database/schema.sql
```

## Step 3: Configure Environment

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teacher_substitution
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_here_make_it_long_and_random
```

Replace `your_postgres_password` with your actual PostgreSQL password.

## Step 4: Create Default Users

Run the setup script to create default users:

```bash
npm run setup
```

This will create:
- **Admin**: username `admin`, password `password123`
- **Staff**: username `staff1`, password `password123`

⚠️ **Important**: Change these passwords after first login in production!

## Step 5: (Optional) Load Sample Data

Load sample teachers and timetables:

```bash
psql -U postgres -d teacher_substitution -f database/seed.sql
```

## Step 6: Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## Step 7: Access the Application

Open your browser and go to:

```
http://localhost:3000
```

## Step 8: Login

Use the default credentials:
- **Incharge**: `admin` / `password123`
- **Staff**: `staff1` / `password123`

## Troubleshooting

### Database Connection Error

- Make sure PostgreSQL is running
- Check your `.env` file has correct database credentials
- Verify the database exists: `\l` in psql

### Port Already in Use

Change the PORT in `.env` file or stop the process using port 3000

### Module Not Found

Run `npm install` again to ensure all dependencies are installed

## Next Steps

1. **Add Teachers**: Go to Teachers page and add your school's teachers
2. **Create Timetables**: Set up class schedules for each teacher
3. **Mark Attendance**: Each day, mark which teachers are present
4. **Assign Substitutions**: The system will automatically assign substitutes

## Support

Check the main README.md for detailed documentation and API endpoints.