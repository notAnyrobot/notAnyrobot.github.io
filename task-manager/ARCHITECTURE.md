# TaskHub - Architecture & Technical Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              FRONTEND (Single Page App)              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ HTML/CSS/JavaScript                                  │   │
│  │ - Responsive UI (Desktop/Tablet/Mobile)              │   │
│  │ - Real-time state management                         │   │
│  │ - Modal forms for CRUD operations                    │   │
│  │ - Calendar rendering (Monthly/Weekly)                │   │
│  │ - Filter & search functionality                      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/JSON REST API
                   │ CORS enabled
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Flask Web Framework                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ API Routes:                                          │   │
│  │ - /api/projects (CRUD)                               │   │
│  │ - /api/tasks (CRUD + filtering)                      │   │
│  │ - /api/calendar/month/<y>/<m>                        │   │
│  │ - /api/calendar/week/<y>/<w>                         │   │
│  │ - /api/tasks/toggle/<id>                             │   │
│  │ - /api/tasks/reorder                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         SQLAlchemy ORM & Models                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ - Project Model (id, name, color, tasks)             │   │
│  │ - Task Model (id, project_id, title, priority, etc)  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ projects table      | tasks table                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ - id (PK)           | - id (PK)                       │   │
│  │ - name              | - project_id (FK)              │   │
│  │ - description       | - title                        │   │
│  │ - color             | - description                  │   │
│  │ - created_at        | - status                       │   │
│  │                     | - priority                     │   │
│  │                     | - due_date                     │   │
│  │                     | - reminder_date                │   │
│  │                     | - order                        │   │
│  │                     | - created_at                   │   │
│  │                     | - updated_at                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **HTML5**: Semantic structure with modals and forms
- **CSS3**: Flexbox/Grid layout, animations, responsive design
- **JavaScript (ES6+)**: Vanilla JS (no frameworks for lightweight)
  - Async/await for API calls
  - DOM manipulation and event delegation
  - Local state management

### Backend
- **Flask 2.3.3**: Lightweight web framework
- **SQLAlchemy 3.0.5**: ORM for database operations
- **Flask-CORS 4.0.0**: Cross-Origin Resource Sharing support
- **SQLite3**: Embedded relational database

### DevOps
- **Python 3.7+**: Runtime environment
- **Virtual Environment**: Package isolation
- **Simple HTTP Server**: Frontend serving (optional)

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3498db',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATETIME,
    reminder_date DATETIME,
    order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

## API Endpoints Reference

### Projects

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/<id>` | Get project details |
| PUT | `/api/projects/<id>` | Update project |
| DELETE | `/api/projects/<id>` | Delete project |

**Request Body Example (POST/PUT):**
```json
{
    "name": "Work Projects",
    "description": "All work-related tasks",
    "color": "#e74c3c"
}
```

### Tasks

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tasks` | List tasks with filters |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/<id>` | Get task details |
| PUT | `/api/tasks/<id>` | Update task |
| DELETE | `/api/tasks/<id>` | Delete task |
| PUT | `/api/tasks/toggle/<id>` | Toggle completion status |
| POST | `/api/tasks/reorder` | Reorder tasks |

**Query Parameters for GET /api/tasks:**
```
?project_id=1
&status=pending
&priority=high
&start_date=2024-01-01T00:00:00
&end_date=2024-01-31T23:59:59
```

**Request Body Example (POST/PUT):**
```json
{
    "project_id": 1,
    "title": "Complete project proposal",
    "description": "Finalize budget and timeline",
    "priority": "high",
    "status": "pending",
    "due_date": "2024-01-15T17:00:00",
    "reminder_date": "2024-01-15T09:00:00"
}
```

### Calendar

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/calendar/month/<year>/<month>` | Get month's tasks |
| GET | `/api/calendar/week/<year>/<week>` | Get week's tasks |

**Example:**
```
GET /api/calendar/month/2024/1    # January 2024 tasks
GET /api/calendar/week/2024/5     # Week 5 of 2024 tasks
```

## State Management (Frontend)

The application uses a centralized state object:

```javascript
const state = {
    projects: [],                  // All projects
    tasks: [],                     // Current filtered tasks
    currentProjectId: null,        // Selected project
    currentFilter: 'all',          // Active filter
    currentView: 'list-view',      // Active tab
    editingTaskId: null,           // Task being edited
    editingProjectId: null,        // Project being edited
    currentMonth: new Date(),      // Calendar navigation
    currentWeek: getISOWeek()      // Week navigation
};
```

## Data Flow

### Creating a Task
1. User clicks "Add Task" button
2. Modal opens with form
3. User fills form and clicks "Save"
4. JavaScript sends POST to `/api/tasks`
5. Backend creates record in database
6. Response returned to frontend
7. Frontend reloads tasks and rerenders
8. If calendar view active, also reload calendar

### Editing a Task
1. User clicks task or edit icon
2. Modal opens with prefilled data
3. User modifies and clicks "Save"
4. JavaScript sends PUT to `/api/tasks/<id>`
5. Backend updates database record
6. Frontend reloads tasks and rerenders
7. All views auto-sync

### Filtering Tasks
1. User selects filter (project, priority, date, etc)
2. JavaScript updates state
3. `renderTasks()` called
4. Filters applied in-memory (no API call for simple filters)
5. DOM re-rendered with filtered results

## Performance Optimizations

### Frontend
- **Event Delegation**: Single listener for many elements
- **Efficient DOM Updates**: Only update changed elements
- **No Framework Overhead**: Vanilla JS is lightweight
- **CSS Animations**: Hardware-accelerated transitions
- **Minimal Re-renders**: Smart state checking

### Backend
- **Query Optimization**: Indexed foreign keys
- **Lazy Loading**: Tasks loaded only when needed
- **Efficient Filtering**: Database-level filters where possible
- **Connection Pooling**: SQLAlchemy manages connections

### Database
- **Indexes**: Primary and foreign keys indexed automatically
- **Relationships**: SQLAlchemy handles cascading deletes
- **Transaction Management**: Atomic operations

## Security Considerations

### Implemented
- **CORS Protection**: Configured for same-origin requests
- **Input Validation**: Form validation on frontend and backend
- **SQL Injection Prevention**: SQLAlchemy parameterized queries
- **Error Handling**: Graceful error responses

### Recommendations for Production
- **Authentication**: Add JWT or session-based auth
- **HTTPS**: Use SSL/TLS certificates
- **Input Sanitization**: Validate all user inputs
- **Rate Limiting**: Prevent API abuse
- **Database Encryption**: Enable at rest encryption
- **Backup Strategy**: Regular automated backups
- **Logging**: Comprehensive access and error logging

## Scalability Roadmap

### Current State (SQLite)
- Single-user local application
- Suitable for 1,000s of tasks
- No network latency

### Phase 1 (PostgreSQL)
- Multi-user support
- Persistent network storage
- Better scalability

### Phase 2 (Distributed)
- Microservices architecture
- Task queue for long operations
- Caching layer (Redis)
- Load balancing

### Phase 3 (Cloud)
- Serverless functions
- Managed database
- CDN for static assets
- Auto-scaling

## Testing Strategy

### Manual Testing (Current)
1. **CRUD Operations**: Test create, read, update, delete for projects/tasks
2. **Filtering**: Test all filter combinations
3. **Views**: Test list, monthly, weekly views
4. **Sync**: Edit in one view, verify update in another
5. **Edge Cases**: Empty states, long titles, special characters

### Automated Testing (Future)
- Unit tests for API endpoints
- Integration tests for workflows
- E2E tests with Selenium/Cypress
- Load testing with Apache JMeter

## Development Workflow

### Adding New Feature
1. Design database schema changes (if needed)
2. Create/update models in `app.py`
3. Create API endpoint
4. Test with curl/Postman
5. Create frontend component in `app.js`
6. Update `index.html` for new UI elements
7. Add styling to `styles.css`
8. Test in all views

### Example: Adding Task Tags
```python
# 1. Update Task model
class Task(db.Model):
    tags = db.Column(db.String(255))  # "python,urgent,deadline"

# 2. Add API endpoint
@app.route('/api/tasks/<int:id>/tags', methods=['PUT'])
def update_task_tags(id):
    # Update logic
    pass

# 3. Update frontend UI
# Add tag input in modal form
# Update renderTasks() to display tags
# Update CSS for tag styling
```

## Debugging Tips

### Backend Issues
```bash
# Enable debug logging
export FLASK_ENV=development
export FLASK_DEBUG=1

# Use Python debugger
import pdb; pdb.set_trace()

# Check database
sqlite3 tasks.db ".tables"
sqlite3 tasks.db ".schema tasks"
sqlite3 tasks.db "SELECT COUNT(*) FROM tasks;"
```

### Frontend Issues
```javascript
// Console logging
console.log('State:', state);
console.log('Tasks:', state.tasks);

// Debugger breakpoint
debugger;

// Check API response
fetch('/api/tasks').then(r => r.json()).then(console.log);
```

## File Structure Explained

```
task-manager/
├── backend/
│   ├── app.py                    # Main Flask application (350 lines)
│   ├── requirements.txt          # Pip dependencies
│   ├── tasks.db                  # SQLite database
│   ├── init_demo_data.py        # Sample data script
│   ├── start.sh / start.bat     # Quick start scripts
│   └── venv/                    # Virtual environment
│
├── frontend/
│   ├── index.html               # HTML structure (220 lines)
│   ├── styles.css              # CSS styling (1000+ lines)
│   ├── app.js                  # JavaScript logic (750+ lines)
│   ├── start.sh / start.bat    # Quick start scripts
│   └── README.md               # Feature documentation
│
├── README.md                    # Main documentation
├── QUICK_START.md              # Setup guide
└── ARCHITECTURE.md             # This file

Total lines of code: ~2,300 lines (including comments and whitespace)
```

## Deployment Options

### Option 1: Local Development
- Run `python app.py` for backend
- Open `index.html` or run simple HTTP server for frontend
- Perfect for single user on local machine

### Option 2: Home Server
- Run on Raspberry Pi or home server
- Access from any device on network
- Update frontend to use server IP

### Option 3: Cloud Hosting
- Deploy Flask to Heroku/PythonAnywhere/Railway
- Host frontend on Netlify/Vercel/GitHub Pages
- Use cloud database (PostgreSQL/MySQL)
- Enable HTTPS and authentication

### Option 4: Docker Containerization
- Create Dockerfile for Flask app
- Use docker-compose for multi-container setup
- Easy deployment and scaling

## Future Enhancements

1. **User Authentication**
   - Login/signup system
   - Per-user task isolation
   - Profile preferences

2. **Collaboration**
   - Share projects/tasks
   - Team collaboration
   - Comments on tasks

3. **Notifications**
   - Desktop notifications
   - Email reminders
   - SMS alerts

4. **Advanced Features**
   - Task dependencies
   - Recurring tasks
   - Time tracking
   - Habits tracking

5. **Mobile App**
   - React Native app
   - iOS/Android support
   - Offline sync

6. **Integrations**
   - Calendar sync (Google/Outlook)
   - Slack notifications
   - GitHub issues integration

---

For more information, see:
- `README.md` - Feature documentation
- `QUICK_START.md` - Setup instructions
