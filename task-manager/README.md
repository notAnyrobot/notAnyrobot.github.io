# TaskHub - Advanced Task Management System

A comprehensive task management application with project organization, calendar views, and real-time synchronization between multiple perspectives.

## Features

### 📋 Project-Based Task Management
- Create and organize projects with custom colors
- Add, edit, delete, and reorder tasks within projects
- Task descriptions, priorities (Low/Medium/High), and status tracking
- Quick project switching with active project highlighting

### 📅 Dual Calendar Views
- **Monthly Calendar**: Full month overview with task counts per day
- **Weekly Calendar**: Detailed week view with hourly task breakdown
- Color-coded task priorities for quick visual scanning
- Navigate between months/weeks with intuitive controls

### ⏰ Due Dates & Reminders
- Set due dates and times for tasks
- Optional reminder notifications
- Visual indicators for overdue/upcoming tasks
- Date range filtering in calendar views

### 🎯 Priority & Status Management
- Three priority levels: Low, Medium, High
- Task completion status (Pending/Completed)
- Visual priority indicators with color coding
- Quick toggle to mark tasks complete/incomplete

### 🔍 Advanced Filtering & Searching
- Filter by project, priority, status, and date range
- Quick filters: All Tasks, Today, Upcoming, Completed
- Combined filter support for precise task discovery
- Real-time filter application

### 🔄 Synchronized Views
- Edit task in list view or calendar → updates everywhere
- Toggle task status → instantly reflected across all views
- Project changes → immediate UI updates
- No page refresh needed

### 💻 Clean, Fast UI
- Responsive design (Desktop, Tablet, Mobile)
- Dark-optimized color scheme with high contrast
- Smooth animations and transitions
- Fast task entry with auto-focus forms

## Project Structure

```
task-manager/
├── backend/
│   ├── app.py              # Flask API server with SQLAlchemy ORM
│   ├── requirements.txt    # Python dependencies
│   └── tasks.db           # SQLite database (auto-created)
└── frontend/
    ├── index.html         # Main HTML structure
    ├── styles.css         # Responsive styling
    ├── app.js            # Complete application logic
    └── README.md         # This file
```

## Setup Instructions

### Prerequisites
- Python 3.7+
- `uv` package manager (fast, modern Python package manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installing uv

**macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy BypassUser -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Or visit: https://github.com/astral-sh/uv

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd task-manager/backend
   ```

2. **Run the Flask server with uv:**
   ```bash
   uv run python app.py
   ```

   This will automatically:
   - Create a virtual environment
   - Install dependencies from `pyproject.toml`
   - Start the Flask server

   The server will start on `http://localhost:5000`

   Expected output:
   ```
   * Running on http://localhost:5000 (Press CTRL+C to quit)
   * Restarting with reloader
   * Debugger is active!
   ```

### Frontend Setup

1. **Open in a web browser:**
   - Option A: Direct file - `file:///path/to/task-manager/frontend/index.html`
   - Option B: Using Python's built-in server:
     ```bash
     cd task-manager/frontend
     python3 -m http.server 8000
     ```
     Then visit: `http://localhost:8000`

2. **Verify connection:**
   - Frontend should automatically connect to `http://localhost:5000`
   - Create a test project and task to verify backend connectivity

## Usage Guide

### Getting Started

1. **Create a Project**
   - Click the `+` button next to "Projects" in the sidebar
   - Enter project name, optional description, and choose a color
   - Click "Save"

2. **Add a Task**
   - Select a project from the sidebar
   - Click `+ Add Task` or press the green button
   - Fill in:
     - **Task Title** (required)
     - **Description** (optional)
     - **Priority** (Low/Medium/High)
     - **Due Date** (optional)
     - **Reminder** (optional)
   - Click "Save"

3. **Manage Tasks**
   - **Complete Task**: Check the checkbox next to task title
   - **Edit Task**: Click the task or click the pencil icon
   - **Delete Task**: Click the X icon or open and click delete
   - **Filter Tasks**: Use the priority and status dropdowns or sidebar filters

### Views

#### List View (Default)
- Default view with all tasks in a list
- Sort by project, priority, and status
- Quick checkbox to mark complete
- Edit/delete buttons on each task

#### Monthly Calendar
- Visual month overview
- Click day to see tasks for that date
- Click task to edit
- Navigate months with < and > buttons
- Today highlighted in blue

#### Weekly Calendar
- 7-day week view
- Daily task columns
- Current day highlighted
- Detailed time information
- Navigate weeks with < and > buttons

### Quick Filters (Sidebar)

- **All Tasks**: Show all tasks from selected project
- **Today**: Tasks due today
- **Upcoming**: Tasks due in the future
- **Completed**: Already completed tasks

### Project Management

- **Select Project**: Click any project in sidebar to view its tasks
- **Edit Project**: Click pencil icon next to project name
- **Delete Project**: Click X icon (deletes all tasks too)
- **Project Color**: Visual identification across the app

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/<id>` - Get project details
- `PUT /api/projects/<id>` - Update project
- `DELETE /api/projects/<id>` - Delete project

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/<id>` - Get task details
- `PUT /api/tasks/<id>` - Update task
- `DELETE /api/tasks/<id>` - Delete task
- `PUT /api/tasks/toggle/<id>` - Toggle completion status

### Calendar
- `GET /api/calendar/month/<year>/<month>` - Get month's tasks
- `GET /api/calendar/week/<year>/<week>` - Get week's tasks

### Query Parameters for Filtering
- `project_id` - Filter by project
- `status` - Filter by status (pending/completed)
- `priority` - Filter by priority (low/medium/high)
- `start_date` - Filter by start date (ISO format)
- `end_date` - Filter by end date (ISO format)

## Database Schema

### Projects Table
- `id` - Primary key
- `name` - Project name (unique)
- `description` - Project description
- `color` - Hex color code
- `created_at` - Timestamp

### Tasks Table
- `id` - Primary key
- `project_id` - Foreign key to projects
- `title` - Task title
- `description` - Task description
- `status` - pending or completed
- `priority` - low, medium, or high
- `due_date` - Optional due date/time
- `reminder_date` - Optional reminder date/time
- `order` - Task order within project (for custom sorting)
- `created_at` - Timestamp
- `updated_at` - Last update timestamp

## Features in Detail

### Real-Time Synchronization
- When you edit a task in the list view, the calendar updates automatically
- Toggling a task's completion status instantly reflects everywhere
- No manual refresh needed
- Changes persist to the database immediately

### Priority Indicators
- **High Priority**: Red color (#e74c3c)
- **Medium Priority**: Orange color (#f39c12)
- **Low Priority**: Gray color (#95a5a6)

### Responsive Design
- Desktop (1200px+): Full layout with sidebar and content
- Tablet (768px-1199px): Adjusted spacing and controls
- Mobile (<768px): Stacked layout with collapsible sections

### Keyboard Support
- Tab navigation through forms
- Enter to submit forms
- Escape to close modals (in supported browsers)

## Troubleshooting

### Backend not connecting
**Problem**: Frontend shows connection error
**Solution**: 
- Ensure Flask server is running on `http://localhost:5000`
- Check firewall settings
- Try accessing `http://localhost:5000/api/health` in browser

### Port 5000 already in use
**Solution**:
```bash
# Kill the process using port 5000
lsof -ti :5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000     # Windows
```

### Database issues
**Solution**: Delete `tasks.db` and restart the server to reset database

### CORS errors
**Solution**: Ensure `Flask-CORS` is installed and the frontend is on same origin or allowed

## Performance Optimization

- SQLite database is lightweight and perfect for this use case
- Frontend implements efficient DOM rendering
- No unnecessary API calls - data fetched on demand
- Smooth transitions with CSS animations, not JavaScript

## Future Enhancements

- Task tags/labels
- Due date notifications via browser notifications
- Task templates for recurring tasks
- Task dependencies and subtasks
- Export/import functionality (CSV, JSON)
- Dark mode toggle
- User authentication and multi-user support
- Task sharing and collaboration
- Mobile app (React Native/Flutter)

## License

MIT License - Feel free to use for personal or commercial projects

## Support

For issues or feature requests, create a detailed description including:
- Expected behavior
- Actual behavior
- Steps to reproduce
- Browser and OS information
- Console errors (F12 → Console tab)
