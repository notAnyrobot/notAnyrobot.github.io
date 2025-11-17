from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
from pathlib import Path

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database configuration
DB_PATH = Path(__file__).parent / 'tasks.db'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==================== Database Models ====================

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    color = db.Column(db.String(7), default='#3498db')  # hex color
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    tasks = db.relationship('Task', backref='project', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color,
            'created_at': self.created_at.isoformat(),
            'task_count': len(self.tasks)
        }


class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, completed
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    due_date = db.Column(db.DateTime)
    reminder_date = db.Column(db.DateTime)
    order = db.Column(db.Integer, default=0)  # for reordering
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'reminder_date': self.reminder_date.isoformat() if self.reminder_date else None,
            'order': self.order,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


# ==================== Project Endpoints ====================

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.order_by(Project.created_at).all()
    return jsonify([p.to_dict() for p in projects])


@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    
    if not data.get('name'):
        return jsonify({'error': 'Project name is required'}), 400
    
    project = Project(
        name=data['name'],
        description=data.get('description', ''),
        color=data.get('color', '#3498db')
    )
    
    try:
        db.session.add(project)
        db.session.commit()
        return jsonify(project.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify(project.to_dict())


@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.json
    
    if 'name' in data:
        project.name = data['name']
    if 'description' in data:
        project.description = data['description']
    if 'color' in data:
        project.color = data['color']
    
    db.session.commit()
    return jsonify(project.to_dict())


@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted'}), 200


# ==================== Task Endpoints ====================

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    project_id = request.args.get('project_id', type=int)
    status = request.args.get('status')
    priority = request.args.get('priority')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Task.query
    
    if project_id:
        query = query.filter_by(project_id=project_id)
    if status:
        query = query.filter_by(status=status)
    if priority:
        query = query.filter_by(priority=priority)
    if start_date:
        start = datetime.fromisoformat(start_date)
        query = query.filter(Task.due_date >= start)
    if end_date:
        end = datetime.fromisoformat(end_date)
        query = query.filter(Task.due_date <= end)
    
    tasks = query.order_by(Task.order, Task.created_at).all()
    return jsonify([t.to_dict() for t in tasks])


@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    
    if not data.get('title') or not data.get('project_id'):
        return jsonify({'error': 'Title and project_id are required'}), 400
    
    # Get max order for this project
    max_order = db.session.query(db.func.max(Task.order)).filter_by(project_id=data['project_id']).scalar() or -1
    
    task = Task(
        project_id=data['project_id'],
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'pending'),
        priority=data.get('priority', 'medium'),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
        reminder_date=datetime.fromisoformat(data['reminder_date']) if data.get('reminder_date') else None,
        order=max_order + 1
    )
    
    try:
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())


@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
    if 'priority' in data:
        task.priority = data['priority']
    if 'due_date' in data:
        task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
    if 'reminder_date' in data:
        task.reminder_date = datetime.fromisoformat(data['reminder_date']) if data['reminder_date'] else None
    if 'order' in data:
        task.order = data['order']
    
    task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(task.to_dict())


@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200


@app.route('/api/tasks/reorder', methods=['POST'])
def reorder_tasks():
    """Reorder tasks within a project"""
    data = request.json
    task_ids = data.get('task_ids', [])
    
    for index, task_id in enumerate(task_ids):
        task = Task.query.get(task_id)
        if task:
            task.order = index
    
    db.session.commit()
    return jsonify({'message': 'Tasks reordered'})


@app.route('/api/tasks/toggle/<int:task_id>', methods=['PUT'])
def toggle_task_status(task_id):
    """Toggle task between pending and completed"""
    task = Task.query.get_or_404(task_id)
    task.status = 'completed' if task.status == 'pending' else 'pending'
    task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(task.to_dict())


# ==================== Calendar Endpoints ====================

@app.route('/api/calendar/month/<int:year>/<int:month>', methods=['GET'])
def get_month_tasks(year, month):
    """Get all tasks for a given month"""
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    tasks = Task.query.filter(
        Task.due_date >= start_date,
        Task.due_date < end_date
    ).all()
    
    return jsonify([t.to_dict() for t in tasks])


@app.route('/api/calendar/week/<int:year>/<int:week>', methods=['GET'])
def get_week_tasks(year, week):
    """Get all tasks for a given ISO week"""
    from datetime import date
    jan4 = date(year, 1, 4)
    week_one_monday = jan4 - timedelta(days=jan4.weekday())
    start_date = week_one_monday + timedelta(weeks=week - 1)
    end_date = start_date + timedelta(days=7)
    
    tasks = Task.query.filter(
        Task.due_date >= start_date,
        Task.due_date < end_date
    ).all()
    
    return jsonify([t.to_dict() for t in tasks])


# ==================== Health Check ====================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
