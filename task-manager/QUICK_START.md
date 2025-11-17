# Quick Start Guide for TaskHub (with uv)

## 🚀 5-Minute Setup

### Prerequisites

Install `uv` - a fast, modern Python package manager:

**macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy BypassUser -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Or visit: https://github.com/astral-sh/uv

### For macOS/Linux Users:

```bash
# 1. Navigate to the project directory
cd task-manager/backend

# 2. Make the start script executable
chmod +x start.sh

# 3. Run the backend
./start.sh
```

This will:
- Check for uv installation
- Install dependencies using uv
- Start the Flask server on http://localhost:5000

**In another terminal window:**

```bash
cd task-manager/frontend
chmod +x start.sh
./start.sh
```

Then open `http://localhost:8000` in your browser.

---

### For Windows Users:

**Terminal 1 (Backend):**
```cmd
cd task-manager\backend
start.bat
```

**Terminal 2 (Frontend):**
```cmd
cd task-manager\frontend
start.bat
```

Then open `http://localhost:8000` in your browser.

---

## 📖 Manual Setup

### Backend

```bash
cd task-manager/backend

# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh  # macOS/Linux

# Run with uv (handles virtual environment and dependencies automatically)
uv run python app.py
```

### Frontend

Option 1: Open directly in browser
- Open `task-manager/frontend/index.html` directly

Option 2: Use Python server
```bash
cd task-manager/frontend
python3 -m http.server 8000
# Visit http://localhost:8000
```

---

## ✅ Verify Setup

1. **Backend running?**
   - Open browser: http://localhost:5000/api/health
   - Should show: `{"status":"ok"}`

2. **Frontend running?**
   - Open browser: http://localhost:8000 (or file:///.../index.html)
   - Should see the TaskHub interface

3. **Connected?**
   - Try creating a project
   - Should work without errors

---

## 🎮 First Steps

1. **Create a Project**
   - Click `+` button next to "Projects"
   - Name it "My First Project"
   - Click Save

2. **Add a Task**
   - Click `+ Add Task`
   - Title: "Welcome to TaskHub"
   - Set due date for today
   - Set priority to High
   - Click Save

3. **Explore Views**
   - Click the "Month" tab to see calendar view
   - Click the "Week" tab for weekly overview
   - Click task to edit it

4. **Try Filters**
   - Click "Today" in sidebar
   - Click "Completed" to see completed tasks

---

## 🆘 Troubleshooting

### "Cannot connect to backend"
- Ensure Flask server is running on terminal 1
- Check no firewall is blocking port 5000
- Try accessing http://localhost:5000/api/health

### "Port 5000 already in use"
```bash
# Kill process using port 5000
lsof -ti :5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000     # Windows (find PID, then taskkill /PID <pid>)
```

### Database errors
- Delete `backend/tasks.db`
- Restart the Flask server

### CORS/Connection issues
- Make sure both servers are running
- Reload the page (Ctrl+R or Cmd+R)
- Check browser console (F12) for errors

---

## 📁 Project Files

```
backend/
├── app.py                    # Main Flask application
├── requirements.txt          # Python packages
├── tasks.db                  # Database (created on first run)
├── start.sh / start.bat      # Quick start scripts
└── venv/                     # Virtual environment (created on setup)

frontend/
├── index.html               # Main UI
├── styles.css              # Styling
├── app.js                  # Application logic
├── start.sh / start.bat    # Quick start scripts
└── README.md               # Full documentation
```

---

## 🎯 What You Can Do

- ✅ Create multiple projects with custom colors
- ✅ Add tasks with titles, descriptions, and priorities
- ✅ Set due dates and reminders
- ✅ View tasks in list, monthly, or weekly format
- ✅ Filter by project, priority, status, date
- ✅ Mark tasks as complete/incomplete
- ✅ Edit and delete tasks
- ✅ Real-time sync between all views
- ✅ Persistent storage in SQLite database

---

## 🚀 Next Steps

1. Check out the main README.md for detailed feature documentation
2. Explore the calendar views
3. Try creating tasks with different priorities
4. Use filters to find specific tasks
5. Customize project colors to organize your work

---

Enjoy using TaskHub! 🎉
