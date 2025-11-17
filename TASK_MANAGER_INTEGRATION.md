# Task Manager Integration Guide

Your GitHub Pages site now includes a full-featured Task Management system integrated into the homepage!

## 🎯 Quick Start

### Option 1: Using with Backend (Full Features)

If you want full features with backend synchronization:

1. **Start the backend server** (from the `task-manager/backend` directory):
   ```bash
   cd task-manager/backend
   chmod +x start.sh
   ./start.sh  # or start.bat on Windows
   ```

2. **Navigate to the Task Manager** on your site:
   - Go to your GitHub Pages site (`https://notanyrobot.github.io/`)
   - Click the **"📋 Task Manager"** button in the top navigation
   - The system will automatically connect to your backend

### Option 2: Using with Local Storage (No Backend Needed)

The Task Manager works perfectly without a backend server:

1. **Open your GitHub Pages site**:
   - Go to `https://notanyrobot.github.io/`
   - Click the **"📋 Task Manager"** button
   - All data is stored in your browser's localStorage

2. **Note**: Data persists in your browser but doesn't sync across devices

## 📋 Features

### ✅ Project Organization
- Create multiple projects with custom names and colors
- Organize tasks by project
- Quick project filtering

### 📅 Calendar Views
- **Monthly Calendar**: See all tasks for the month at a glance
- **Weekly Calendar**: Detailed weekly view with task distribution
- **List View**: Traditional task list with full details

### 🏷️ Task Management
- Add tasks with title and description
- Set priorities (Low, Medium, High)
- Assign due dates and reminders
- Mark tasks as completed
- Edit and delete tasks

### 🔍 Advanced Filtering
- Filter by project
- Filter by date (Today, Upcoming)
- Filter by priority
- Filter by status (Pending, Completed)

### ⚡ Real-Time Synchronization
- Changes instantly sync across all views
- Views update automatically when you add/edit tasks
- Smooth animations and transitions

## 🗂️ File Structure

```
github.io/
├── index.html                    # Enhanced homepage with Task Manager button
├── task-manager/
│   ├── index.html               # Task Manager page (statically hosted)
│   ├── frontend/
│   │   ├── index.html           # Original task manager UI
│   │   ├── app.js               # Application logic (enhanced with localStorage)
│   │   └── styles.css           # Complete styling
│   ├── backend/
│   │   ├── app.py              # Flask server (optional)
│   │   ├── pyproject.toml       # Dependencies config
│   │   ├── start.sh             # Linux/macOS launcher
│   │   └── start.bat            # Windows launcher
│   └── README.md                # Task Manager documentation
```

## 🌐 How It Works

### When Backend is Available
1. Your task data is stored in a SQLite database
2. The frontend communicates with the Flask backend via HTTP
3. Changes sync in real-time with the backend
4. Data persists across browser sessions and devices

### When Backend is Not Available
1. Your task data is stored in browser localStorage
2. The frontend operates completely offline
3. Changes are saved locally in your browser
4. A status indicator shows "Using local storage"

## 🔗 Integration Points

### Homepage Navigation
The updated `index.html` now includes:
- Navigation bar with home, about, and projects links
- **Task Manager button** that links to `/task-manager/index.html`
- Professional styling with gradient background
- Featured projects section

### Task Manager Page
The `/task-manager/index.html` page provides:
- Back link to home
- Full task management interface
- Automatic backend detection
- Connection status indicator

## 💾 Data Management

### localStorage
- **Key**: `taskManager_projects` - Stores all projects
- **Key**: `taskManager_tasks` - Stores all tasks
- **Location**: Browser's local storage (survives page refresh)
- **Scope**: Per domain/browser
- **Size**: ~5MB limit per domain

### Backend Database
- **Location**: `task-manager/backend/tasks.db`
- **Type**: SQLite (single file database)
- **Size**: Unlimited (practically)
- **Scope**: All users accessing your backend

## 🚀 Deployment Options

### GitHub Pages Only (Recommended for Static Hosting)
- No backend server needed
- Works directly on GitHub Pages
- Data stored in browser localStorage
- Deployed automatically with your repository

```bash
# Just push your changes to GitHub
git add .
git commit -m "Add Task Manager integration"
git push origin main
```

### With Backend Server (Additional Setup)
If you want to run the backend:

1. **Deploy to a server** (Heroku, Railway, Render, etc.)
2. **Update API_BASE** in `frontend/app.js`:
   ```javascript
   const API_BASE = 'https://your-backend-url.com/api';
   ```
3. **Rebuild and redeploy**

## 🔌 API Reference (if using backend)

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/toggle/:id` - Toggle task status

### Calendar
- `GET /api/calendar/month/:year/:month` - Get month tasks
- `GET /api/calendar/week/:year/:week` - Get week tasks

## 🛠️ Customization

### Change Colors
Edit the gradient in `/index.html`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change API Base
Edit in `/task-manager/frontend/app.js`:
```javascript
const API_BASE = 'http://your-custom-api.com/api';
```

### Add More Features
The application is modular and easy to extend:
- Add new task properties in the modal forms
- Create new filtering options
- Add new calendar views
- Integrate with other services

## ❓ Troubleshooting

### "Using local storage" Message
- Backend server is not running
- Check `http://localhost:5000/api/health` is accessible
- **This is normal and expected on GitHub Pages**

### Tasks Not Saving
- Check browser console for errors
- Verify localStorage is enabled
- Try a different browser
- Clear browser cache and reload

### Backend Connection Issues
- Verify the Flask server is running
- Check the API_BASE URL is correct
- Ensure CORS is enabled
- Check server logs for errors

## 📱 Responsive Design

The Task Manager is fully responsive:
- **Desktop** (1200px+): Full layout with sidebar
- **Tablet** (768-1199px): Responsive grid
- **Mobile** (<768px): Optimized touch interface

## 🎨 UI/UX Features

- **Color-coded projects**: Each project has a unique color
- **Priority indicators**: Visual priority levels (Low/Medium/High)
- **Status icons**: Checkmarks for completed tasks
- **Date formatting**: Human-readable dates
- **Smooth animations**: Transitions between views
- **Accessibility**: Keyboard navigation support

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the Task Manager README: `/task-manager/README.md`
3. Check the architecture docs: `/task-manager/ARCHITECTURE.md`

## 📈 Next Steps

1. **Test the integration**: Click the Task Manager button on your homepage
2. **Create some projects**: Get familiar with the interface
3. **Add some tasks**: Explore the different views and filters
4. **Share your feedback**: Let me know what features you'd like!

Enjoy your new Task Management System! 🎉
