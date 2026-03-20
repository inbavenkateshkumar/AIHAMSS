# Project Structure Overview

## Directory Tree

```
timetable/
│
├── config/
│   └── database.js              # PostgreSQL connection pool
│
├── controllers/                 # Business logic
│   ├── authController.js        # Login, Register
│   ├── teacherController.js     # Teacher CRUD operations
│   ├── timetableController.js   # Timetable CRUD operations
│   ├── attendanceController.js  # Mark/view attendance
│   ├── substitutionController.js # Core substitution algorithm
│   ├── dashboardController.js   # Dashboard statistics
│   └── notificationController.js # Notifications
│
├── database/
│   ├── schema.sql               # Database schema (tables, indexes, triggers)
│   └── seed.sql                 # Sample data (teachers, timetables)
│
├── middleware/
│   └── auth.js                  # JWT authentication & authorization
│
├── routes/                      # API route definitions
│   ├── auth.js                  # /api/auth/*
│   ├── teachers.js              # /api/teachers/*
│   ├── timetables.js            # /api/timetables/*
│   ├── attendance.js            # /api/attendance/*
│   ├── substitutions.js         # /api/substitutions/*
│   ├── dashboard.js             # /api/dashboard/*
│   └── notifications.js         # /api/notifications/*
│
├── public/                      # Frontend files (served statically)
│   ├── css/
│   │   └── style.css            # All styling (responsive, modern UI)
│   │
│   ├── js/
│   │   ├── api.js               # API helper functions
│   │   ├── auth.js              # Login/signup logic
│   │   ├── dashboard.js         # Dashboard interactions
│   │   ├── teachers.js          # Teacher management
│   │   ├── timetables.js        # Timetable management
│   │   ├── attendance.js        # Attendance marking
│   │   └── substitutions.js     # Substitution viewing
│   │
│   ├── index.html               # Login/Signup page
│   ├── dashboard.html           # Main dashboard
│   ├── teachers.html            # Teacher CRUD interface
│   ├── timetables.html          # Timetable CRUD interface
│   ├── attendance.html          # Attendance marking interface
│   └── substitutions.html       # Substitution records view
│
├── server.js                    # Express server entry point
├── setup.js                     # Initial setup script (create users)
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
│
└── Documentation/
    ├── README.md                # Main documentation
    ├── QUICKSTART.md            # Quick setup guide
    ├── SUBSTITUTION_LOGIC.md    # Algorithm explanation
    └── PROJECT_STRUCTURE.md     # This file
```

## Database Schema

### Tables

1. **users** - Authentication (Incharge/Staff)
   - id, username, email, password_hash, role, created_at

2. **teachers** - Teacher information
   - id, name, subject, phone, email, max_substitution_limit, current_substitution_count

3. **timetables** - Class schedules
   - id, teacher_id, day, period_number, class_name, subject

4. **attendance** - Daily attendance records
   - id, teacher_id, date, status, marked_by, created_at

5. **substitutions** - Substitution assignments
   - id, absent_teacher_id, substitute_teacher_id, class_name, subject, period_number, day, date, status

6. **notifications** - System notifications
   - id, user_id, teacher_id, substitution_id, message, type, read_status, created_at

## API Flow

```
Client (Browser)
    ↓
Frontend (HTML/JS)
    ↓
API Request (AJAX/Fetch)
    ↓
Express Routes (/routes/)
    ↓
Authentication Middleware (JWT check)
    ↓
Authorization Middleware (Role check if needed)
    ↓
Controllers (/controllers/)
    ↓
Database Queries (PostgreSQL via pg)
    ↓
Response (JSON)
    ↓
Frontend Update (DOM manipulation)
```

## Key Features by Page

### index.html (Login/Signup)
- User authentication
- Role-based access (Incharge/Staff)
- JWT token storage

### dashboard.html
- Statistics overview
- Absent teachers list
- Today's substitutions
- Teacher workload summary
- Assign substitutions button (Incharge only)

### teachers.html
- View all teachers
- Add/Edit/Delete teachers (Incharge only)
- View substitution limits

### timetables.html
- View all timetable entries
- Add/Edit/Delete entries (Incharge only)
- Filter by teacher/day

### attendance.html
- Mark present/absent for all teachers
- Date selector
- Submit attendance
- Visual attendance cards

### substitutions.html
- View substitution records
- Filter by date
- View all historical substitutions
- Delete substitutions (Incharge only)

## Security Features

1. **JWT Authentication**: Token-based authentication
2. **Password Hashing**: bcryptjs for secure password storage
3. **Role-Based Access**: Incharge vs Staff permissions
4. **SQL Injection Prevention**: Parameterized queries
5. **CORS Configuration**: Controlled API access

## Technology Choices

- **Express.js**: Fast, minimal web framework
- **PostgreSQL**: Robust relational database
- **pg (node-postgres)**: Native PostgreSQL client
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation/verification
- **Vanilla JavaScript**: No framework overhead, educational focus
- **CSS3**: Modern styling with flexbox/grid

## Development Workflow

1. **Database First**: Create schema → Seed data
2. **Backend Second**: Routes → Controllers → Logic
3. **Frontend Last**: HTML → CSS → JavaScript
4. **Testing**: Manual testing through browser

## Deployment Considerations

- Set strong JWT_SECRET in production
- Use environment variables for all secrets
- Enable HTTPS in production
- Set up proper database backups
- Consider adding rate limiting
- Add logging/monitoring
- Set up email notifications (future)

## Extension Ideas

- Email/SMS notifications
- Calendar integration
- Mobile app (React Native)
- Advanced analytics/reporting
- Multi-school support
- Teacher preferences system
- Automated email reminders
- Export to PDF/Excel