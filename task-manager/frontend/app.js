// ==================== CONFIG ====================
const API_BASE = 'http://localhost:5000/api';
let USE_BACKEND = false;
let BACKEND_CHECKED = false;

// ==================== STATE MANAGEMENT ====================
const state = {
    projects: [],
    tasks: [],
    currentProjectId: null,
    currentFilter: 'all',
    currentView: 'list-view',
    editingTaskId: null,
    editingProjectId: null,
    currentMonth: new Date(),
    currentWeek: getISOWeek(new Date()),
};

// ==================== UTILITY FUNCTIONS ====================

function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function toLocalISOString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function isUpcoming(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
}

function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

function getMonthName(monthIndex) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
}

function isSameWeek(date, weekNumber, year) {
    return getISOWeek(date) === weekNumber && date.getFullYear() === year;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==================== BACKEND CONNECTION CHECK ====================

async function checkBackendConnection() {
    if (BACKEND_CHECKED) return USE_BACKEND;
    BACKEND_CHECKED = true;

    try {
        const response = await fetch(`${API_BASE}/health`, { 
            method: 'GET',
            mode: 'cors'
        });
        USE_BACKEND = response.ok;
        updateConnectionStatus();
    } catch (error) {
        console.log('Backend not available, using localStorage');
        USE_BACKEND = false;
        updateConnectionStatus();
    }
    return USE_BACKEND;
}

function updateConnectionStatus() {
    const statusEl = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    if (statusEl && statusText) {
        if (USE_BACKEND) {
            statusEl.style.background = '#4caf50';
            statusText.textContent = '✓ Connected to backend';
            statusEl.style.display = 'block';
            setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
        } else {
            statusEl.style.background = '#ff9800';
            statusText.textContent = '⚠ Using local storage (backend not available)';
            statusEl.style.display = 'block';
        }
    }
}

// ==================== LOCAL STORAGE FUNCTIONS ====================

function saveToLocalStorage() {
    localStorage.setItem('taskManager_projects', JSON.stringify(state.projects));
    localStorage.setItem('taskManager_tasks', JSON.stringify(state.tasks));
}

function loadFromLocalStorage() {
    try {
        const projects = localStorage.getItem('taskManager_projects');
        const tasks = localStorage.getItem('taskManager_tasks');
        
        if (projects) state.projects = JSON.parse(projects);
        if (tasks) state.tasks = JSON.parse(tasks);
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ==================== ENHANCED API CALLS ====================

// ==================== ENHANCED API CALLS ====================

async function apiCall(endpoint, options = {}) {
    const useBackend = await checkBackendConnection();
    const url = `${API_BASE}${endpoint}`;
    const defaultHeaders = { 'Content-Type': 'application/json' };
    
    if (!useBackend) {
        throw new Error('Backend not available - using localStorage');
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return response.status === 204 ? null : await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        USE_BACKEND = false;
        updateConnectionStatus();
        throw error;
    }
}

// Projects API - with localStorage fallback
async function getProjects() {
    try {
        return await apiCall('/projects');
    } catch {
        return state.projects;
    }
}

async function createProject(projectData) {
    try {
        return await apiCall('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    } catch {
        const newProject = {
            id: generateId(),
            name: projectData.name,
            description: projectData.description || '',
            color: projectData.color || '#667eea',
            created_at: new Date().toISOString()
        };
        state.projects.push(newProject);
        saveToLocalStorage();
        return newProject;
    }
}

async function updateProject(projectId, projectData) {
    try {
        return await apiCall(`/projects/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    } catch {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            Object.assign(project, projectData);
            saveToLocalStorage();
        }
        return project;
    }
}

async function deleteProject(projectId) {
    try {
        return await apiCall(`/projects/${projectId}`, {
            method: 'DELETE'
        });
    } catch {
        state.projects = state.projects.filter(p => p.id !== projectId);
        state.tasks = state.tasks.filter(t => t.project_id !== projectId);
        saveToLocalStorage();
    }
}

// Tasks API - with localStorage fallback
async function getTasks(filters = {}) {
    try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return await apiCall(`/tasks?${params}`);
    } catch {
        return state.tasks;
    }
}

async function createTask(taskData) {
    try {
        return await apiCall('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    } catch {
        const newTask = {
            id: generateId(),
            project_id: taskData.project_id,
            title: taskData.title,
            description: taskData.description || '',
            status: 'pending',
            priority: taskData.priority || 'medium',
            due_date: taskData.due_date || null,
            reminder_date: taskData.reminder_date || null,
            order: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        state.tasks.push(newTask);
        saveToLocalStorage();
        return newTask;
    }
}

async function updateTask(taskId, taskData) {
    try {
        return await apiCall(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    } catch {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            Object.assign(task, taskData, { updated_at: new Date().toISOString() });
            saveToLocalStorage();
        }
        return task;
    }
}

async function deleteTask(taskId) {
    try {
        return await apiCall(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
    } catch {
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        saveToLocalStorage();
    }
}

async function toggleTaskStatus(taskId) {
    try {
        return await apiCall(`/tasks/toggle/${taskId}`, {
            method: 'PUT'
        });
    } catch {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'pending' ? 'completed' : 'pending';
            task.updated_at = new Date().toISOString();
            saveToLocalStorage();
        }
        return task;
    }
}

async function reorderTasks(taskIds) {
    try {
        return await apiCall('/tasks/reorder', {
            method: 'POST',
            body: JSON.stringify({ task_ids: taskIds })
        });
    } catch {
        taskIds.forEach((id, index) => {
            const task = state.tasks.find(t => t.id === id);
            if (task) task.order = index;
        });
        saveToLocalStorage();
    }
}

async function getMonthTasks(year, month) {
    try {
        return await apiCall(`/calendar/month/${year}/${month}`);
    } catch {
        // Fallback: compute locally
        const monthTasks = state.tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate.getFullYear() === year && taskDate.getMonth() === month - 1;
        });
        return { year, month, tasks: monthTasks };
    }
}

async function getWeekTasks(year, week) {
    try {
        return await apiCall(`/calendar/week/${year}/${week}`);
    } catch {
        // Fallback: compute locally
        const weekTasks = state.tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return isSameWeek(taskDate, week, year);
        });
        return { year, week, tasks: weekTasks };
    }
}

// ==================== DATA LOADING ====================

async function loadProjects() {
    try {
        state.projects = await getProjects();
        renderProjects();
        updateProjectSelect();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function loadTasks() {
    try {
        const filters = {};
        if (state.currentProjectId) {
            filters.project_id = state.currentProjectId;
        }
        state.tasks = await getTasks(filters);
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function loadCalendar() {
    try {
        const year = state.currentMonth.getFullYear();
        const month = state.currentMonth.getMonth() + 1;
        const calendarTasks = await getMonthTasks(year, month);
        renderMonthCalendar(calendarTasks);
    } catch (error) {
        console.error('Error loading calendar:', error);
    }
}

async function loadWeekCalendar() {
    try {
        const year = state.currentMonth.getFullYear();
        const week = getISOWeek(state.currentMonth);
        const weekTasks = await getWeekTasks(year, week);
        renderWeekCalendar(weekTasks);
    } catch (error) {
        console.error('Error loading week calendar:', error);
    }
}

// ==================== RENDERING ====================

function renderProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    state.projects.forEach(project => {
        const li = document.createElement('li');
        li.className = `project-item ${state.currentProjectId === project.id ? 'active' : ''}`;
        li.innerHTML = `
            <span class="project-name">${project.name}</span>
            <div class="project-actions">
                <button class="project-edit-btn" title="Edit">✎</button>
                <button class="project-delete-btn" title="Delete">✕</button>
            </div>
        `;
        
        li.addEventListener('click', (e) => {
            if (e.target.closest('.project-edit-btn')) {
                editProject(project.id);
            } else if (e.target.closest('.project-delete-btn')) {
                deleteProjectConfirm(project.id);
            } else {
                selectProject(project.id);
            }
        });
        
        projectsList.appendChild(li);
    });
}

function selectProject(projectId) {
    state.currentProjectId = projectId;
    state.currentFilter = 'all';
    renderProjects();
    loadTasks();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    updateViewTitle();
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    // Apply filters
    let filteredTasks = state.tasks;
    
    if (state.currentFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filteredTasks = filteredTasks.filter(task => {
            switch (state.currentFilter) {
                case 'today':
                    return task.due_date && isToday(new Date(task.due_date));
                case 'upcoming':
                    return task.due_date && isUpcoming(new Date(task.due_date));
                case 'completed':
                    return task.status === 'completed';
                default:
                    return true;
            }
        });
    }
    
    // Apply priority filter
    const priorityFilter = document.getElementById('priorityFilter').value;
    if (priorityFilter) {
        filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }
    
    // Apply status filter
    const statusFilter = document.getElementById('statusFilter').value;
    if (statusFilter) {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No tasks yet. Create one to get started!</div>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        const dueDate = task.due_date ? new Date(task.due_date) : null;
        const project = state.projects.find(p => p.id === task.project_id);
        
        li.className = `task-item ${task.status} ${task.priority}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="task-meta-item">📁 ${project?.name || 'Unknown'}</span>
                    ${dueDate ? `<span class="task-meta-item">📅 ${formatDate(task.due_date)}</span>` : ''}
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-edit-btn" title="Edit">✎</button>
                <button class="task-delete-btn" title="Delete">✕</button>
            </div>
        `;
        
        li.querySelector('.task-checkbox').addEventListener('change', () => {
            toggleTaskStatus(task.id).then(() => {
                loadTasks();
                if (state.currentView !== 'list-view') {
                    loadCalendar();
                }
            });
        });
        
        li.querySelector('.task-content').addEventListener('click', () => {
            editTask(task.id);
        });
        
        li.querySelector('.task-edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            editTask(task.id);
        });
        
        li.querySelector('.task-delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTaskConfirm(task.id);
        });
        
        tasksList.appendChild(li);
    });
}

function renderMonthCalendar(calendarTasks) {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    
    document.getElementById('monthTitle').textContent = 
        `${getMonthName(month)} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = document.getElementById('calendarMonth');
    calendar.innerHTML = '';
    
    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const div = document.createElement('div');
        div.className = 'calendar-day-name';
        div.textContent = day;
        calendar.appendChild(div);
    });
    
    // Days
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        if (currentDate.getMonth() !== month) {
            dayDiv.classList.add('other-month');
        }
        
        if (isToday(currentDate)) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.innerHTML = `<div class="calendar-day-number">${currentDate.getDate()}</div>`;
        
        const dayTasks = calendarTasks.filter(task => {
            const taskDate = new Date(task.due_date);
            return taskDate.toDateString() === currentDate.toDateString();
        });
        
        if (dayTasks.length > 0) {
            const tasksDiv = document.createElement('div');
            tasksDiv.className = 'calendar-day-tasks';
            dayTasks.forEach(task => {
                const taskSpan = document.createElement('span');
                taskSpan.className = `calendar-task ${task.priority}`;
                taskSpan.textContent = task.title.substring(0, 15);
                taskSpan.addEventListener('click', () => editTask(task.id));
                tasksDiv.appendChild(taskSpan);
            });
            dayDiv.appendChild(tasksDiv);
        }
        
        calendar.appendChild(dayDiv);
    }
}

function renderWeekCalendar(weekTasks) {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    const date = state.currentMonth.getDate();
    
    const d = new Date(year, month, date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const weekStart = new Date(d.setDate(diff));
    
    const week = getISOWeek(weekStart);
    document.getElementById('weekTitle').textContent = 
        `Week ${week} - ${formatDate(weekStart)} to ${formatDate(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}`;
    
    const weekGrid = document.getElementById('calendarWeek');
    weekGrid.innerHTML = '';
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + i);
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'week-day';
        
        if (isToday(currentDate)) {
            dayDiv.classList.add('today');
        }
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'week-day-header';
        headerDiv.innerHTML = `
            <div>${getDayName(i)}</div>
            <div class="week-day-date">${currentDate.getDate()}</div>
        `;
        dayDiv.appendChild(headerDiv);
        
        const tasksDiv = document.createElement('div');
        tasksDiv.className = 'week-day-tasks';
        
        const dayTasks = weekTasks.filter(task => {
            const taskDate = new Date(task.due_date);
            return taskDate.toDateString() === currentDate.toDateString();
        });
        
        dayTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `week-task ${task.priority} ${task.status}`;
            taskDiv.textContent = task.title;
            taskDiv.addEventListener('click', () => editTask(task.id));
            tasksDiv.appendChild(taskDiv);
        });
        
        dayDiv.appendChild(tasksDiv);
        weekGrid.appendChild(dayDiv);
    }
}

function updateViewTitle() {
    const projectId = state.currentProjectId;
    const project = state.projects.find(p => p.id === projectId);
    
    let title = 'All Tasks';
    
    if (state.currentFilter !== 'all') {
        const filterNames = {
            today: 'Today\'s Tasks',
            upcoming: 'Upcoming Tasks',
            completed: 'Completed Tasks'
        };
        title = filterNames[state.currentFilter] || 'All Tasks';
    } else if (project) {
        title = project.name;
    }
    
    document.getElementById('viewTitle').textContent = title;
}

function updateProjectSelect() {
    const select = document.getElementById('taskProject');
    select.innerHTML = '';
    state.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        if (state.currentProjectId === project.id) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

// ==================== MODAL HANDLING ====================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Project Modal
document.getElementById('btnAddProject').addEventListener('click', () => {
    state.editingProjectId = null;
    document.getElementById('projectForm').reset();
    document.getElementById('projectModalTitle').textContent = 'New Project';
    openModal('projectModal');
});

document.getElementById('closeProjectModal').addEventListener('click', () => {
    closeModal('projectModal');
});

document.getElementById('cancelProject').addEventListener('click', () => {
    closeModal('projectModal');
});

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectData = {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        color: document.getElementById('projectColor').value
    };
    
    try {
        if (state.editingProjectId) {
            await updateProject(state.editingProjectId, projectData);
        } else {
            await createProject(projectData);
        }
        closeModal('projectModal');
        loadProjects();
        loadTasks();
    } catch (error) {
        console.error('Error saving project:', error);
    }
});

function editProject(projectId) {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;
    
    state.editingProjectId = projectId;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('projectColor').value = project.color || '#3498db';
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    openModal('projectModal');
}

async function deleteProjectConfirm(projectId) {
    if (confirm('Are you sure you want to delete this project and all its tasks?')) {
        try {
            await deleteProject(projectId);
            if (state.currentProjectId === projectId) {
                state.currentProjectId = null;
            }
            loadProjects();
            loadTasks();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }
}

// Task Modal
document.getElementById('btnAddTask').addEventListener('click', () => {
    if (state.projects.length === 0) {
        alert('Please create a project first!');
        return;
    }
    state.editingTaskId = null;
    document.getElementById('taskForm').reset();
    document.getElementById('taskModalTitle').textContent = 'New Task';
    document.getElementById('deleteTaskBtn').style.display = 'none';
    
    // Set current project
    if (state.currentProjectId) {
        document.getElementById('taskProject').value = state.currentProjectId;
    }
    
    openModal('taskModal');
});

document.getElementById('closeTaskModal').addEventListener('click', () => {
    closeModal('taskModal');
});

document.getElementById('cancelTask').addEventListener('click', () => {
    closeModal('taskModal');
});

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskData = {
        project_id: parseInt(document.getElementById('taskProject').value),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        due_date: document.getElementById('taskDueDate').value || null,
        reminder_date: document.getElementById('taskReminder').value || null,
        status: 'pending'
    };
    
    try {
        if (state.editingTaskId) {
            await updateTask(state.editingTaskId, taskData);
        } else {
            await createTask(taskData);
        }
        closeModal('taskModal');
        loadTasks();
        if (state.currentView !== 'list-view') {
            loadCalendar();
        }
    } catch (error) {
        console.error('Error saving task:', error);
    }
});

function editTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    state.editingTaskId = taskId;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskProject').value = task.project_id;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDueDate').value = task.due_date ? task.due_date.substring(0, 16) : '';
    document.getElementById('taskReminder').value = task.reminder_date ? task.reminder_date.substring(0, 16) : '';
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('deleteTaskBtn').style.display = 'block';
    
    openModal('taskModal');
}

document.getElementById('deleteTaskBtn').addEventListener('click', async () => {
    if (state.editingTaskId && confirm('Are you sure you want to delete this task?')) {
        try {
            await deleteTask(state.editingTaskId);
            closeModal('taskModal');
            loadTasks();
            if (state.currentView !== 'list-view') {
                loadCalendar();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
});

async function deleteTaskConfirm(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await deleteTask(taskId);
            loadTasks();
            if (state.currentView !== 'list-view') {
                loadCalendar();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
}

// ==================== TAB NAVIGATION ====================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show selected content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        state.currentView = tabName;
        
        // Load data for the view
        if (tabName === 'calendar-month') {
            loadCalendar();
        } else if (tabName === 'calendar-week') {
            loadWeekCalendar();
        }
    });
});

// ==================== CALENDAR NAVIGATION ====================

document.getElementById('prevMonth').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    loadCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    loadCalendar();
});

document.getElementById('prevWeek').addEventListener('click', () => {
    state.currentMonth.setDate(state.currentMonth.getDate() - 7);
    loadWeekCalendar();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    state.currentMonth.setDate(state.currentMonth.getDate() + 7);
    loadWeekCalendar();
});

// ==================== FILTERS ====================

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        state.currentFilter = filter;
        state.currentProjectId = null;
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        
        loadTasks();
        updateViewTitle();
    });
});

document.getElementById('priorityFilter').addEventListener('change', () => {
    renderTasks();
});

document.getElementById('statusFilter').addEventListener('change', () => {
    renderTasks();
});

// ==================== MODAL OUTSIDE CLICK ====================

window.addEventListener('click', (e) => {
    const projectModal = document.getElementById('projectModal');
    const taskModal = document.getElementById('taskModal');
    
    if (e.target === projectModal) {
        closeModal('projectModal');
    }
    if (e.target === taskModal) {
        closeModal('taskModal');
    }
});

// ==================== INITIALIZATION ====================

async function initialize() {
    try {
        await checkBackendConnection();
        
        if (USE_BACKEND) {
            // Load from backend
            state.projects = await getProjects();
            state.tasks = await getTasks();
        } else {
            // Load from localStorage
            loadFromLocalStorage();
        }
        
        renderProjects();
        renderTasks();
        updateProjectSelect();
    } catch (error) {
        console.error('Initialization error:', error);
        loadFromLocalStorage();
        renderProjects();
        renderTasks();
        updateProjectSelect();
    }
}

// Start the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
