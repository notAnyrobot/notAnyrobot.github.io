"""
Demo Data Initialization Script for TaskHub

This script populates the database with sample projects and tasks
to help you get started with the application.

Usage:
    python init_demo_data.py
"""

import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path to import app
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, Project, Task

def init_demo_data():
    """Initialize database with demo data"""
    
    with app.app_context():
        # Clear existing data (optional)
        print("🗑️  Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        print("📝 Creating sample projects...")
        
        # Create sample projects
        projects = [
            Project(
                name="Personal",
                description="Personal tasks and goals",
                color="#3498db"
            ),
            Project(
                name="Work",
                description="Work-related tasks and projects",
                color="#e74c3c"
            ),
            Project(
                name="Learning",
                description="Learning and skill development",
                color="#2ecc71"
            ),
            Project(
                name="Home",
                description="Household and maintenance tasks",
                color="#f39c12"
            ),
        ]
        
        for project in projects:
            db.session.add(project)
        
        db.session.commit()
        print(f"✅ Created {len(projects)} projects")
        
        print("📋 Creating sample tasks...")
        
        # Create sample tasks
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        sample_tasks = [
            # Personal Project Tasks
            Task(
                project_id=1,
                title="Complete Python learning path",
                description="Finish the Advanced Python course on Udemy",
                priority="high",
                due_date=today + timedelta(days=3),
                reminder_date=today + timedelta(days=2),
                status="pending",
                order=0
            ),
            Task(
                project_id=1,
                title="Morning workout",
                description="30 min jog in the park",
                priority="medium",
                due_date=today,
                status="pending",
                order=1
            ),
            Task(
                project_id=1,
                title="Read Chapter 5 of 'Atomic Habits'",
                description="Continue reading and take notes",
                priority="medium",
                due_date=today + timedelta(days=1),
                status="pending",
                order=2
            ),
            Task(
                project_id=1,
                title="Plan weekend trip",
                description="Research destinations and book accommodation",
                priority="low",
                due_date=today + timedelta(days=7),
                status="pending",
                order=3
            ),
            
            # Work Project Tasks
            Task(
                project_id=2,
                title="Complete Q4 project proposal",
                description="Finalize budget and timeline for new initiative",
                priority="high",
                due_date=today + timedelta(days=1),
                reminder_date=today,
                status="pending",
                order=0
            ),
            Task(
                project_id=2,
                title="Review code pull requests",
                description="Check and approve pending PRs from team",
                priority="high",
                due_date=today,
                status="pending",
                order=1
            ),
            Task(
                project_id=2,
                title="Team meeting - Sprint planning",
                description="Weekly sprint planning meeting at 10 AM",
                priority="medium",
                due_date=today + timedelta(days=2),
                status="pending",
                order=2
            ),
            Task(
                project_id=2,
                title="Document API endpoints",
                description="Update REST API documentation for v2.0",
                priority="medium",
                due_date=today + timedelta(days=5),
                status="pending",
                order=3
            ),
            Task(
                project_id=2,
                title="Send progress report",
                description="Monthly progress report to stakeholders",
                priority="low",
                due_date=today + timedelta(days=30),
                status="pending",
                order=4
            ),
            
            # Learning Project Tasks
            Task(
                project_id=3,
                title="JavaScript ES6+ Features",
                description="Study arrow functions, destructuring, and async/await",
                priority="high",
                due_date=today + timedelta(days=4),
                status="pending",
                order=0
            ),
            Task(
                project_id=3,
                title="Practice SQL joins",
                description="Complete LeetCode SQL problems 1-10",
                priority="medium",
                due_date=today + timedelta(days=2),
                status="pending",
                order=1
            ),
            Task(
                project_id=3,
                title="Build React mini-project",
                description="Create a todo list app with React hooks",
                priority="medium",
                due_date=today + timedelta(days=10),
                status="pending",
                order=2
            ),
            Task(
                project_id=3,
                title="Machine Learning basics",
                description="Watch ML course modules 1-3",
                priority="low",
                due_date=today + timedelta(days=14),
                status="pending",
                order=3
            ),
            
            # Home Project Tasks
            Task(
                project_id=4,
                title="Grocery shopping",
                description="Buy milk, bread, eggs, and vegetables",
                priority="high",
                due_date=today,
                status="pending",
                order=0
            ),
            Task(
                project_id=4,
                title="Clean the kitchen",
                description="Deep clean - cabinet, counters, and appliances",
                priority="medium",
                due_date=today + timedelta(days=1),
                status="pending",
                order=1
            ),
            Task(
                project_id=4,
                title="Fix leaky bathroom tap",
                description="Call plumber and schedule repair",
                priority="high",
                due_date=today + timedelta(days=3),
                status="pending",
                order=2
            ),
            Task(
                project_id=4,
                title="Organize garage",
                description="Sort tools, boxes, and donate unused items",
                priority="low",
                due_date=today + timedelta(days=7),
                status="pending",
                order=3
            ),
            Task(
                project_id=4,
                title="Water the plants",
                description="Check all indoor and outdoor plants",
                priority="medium",
                due_date=today + timedelta(days=2),
                status="pending",
                order=4
            ),
        ]
        
        for task in sample_tasks:
            db.session.add(task)
        
        db.session.commit()
        print(f"✅ Created {len(sample_tasks)} tasks")
        
        print("\n" + "="*50)
        print("🎉 Demo data initialized successfully!")
        print("="*50)
        print("\nProjects created:")
        for project in projects:
            print(f"  • {project.name}")
        
        print("\nYou can now:")
        print("  1. Start the Flask server: python app.py")
        print("  2. Open the frontend: frontend/index.html")
        print("  3. Explore all the demo tasks and projects")
        print("\n💡 Tip: You can delete all demo data by running this script again")
        print("         or by deleting tasks.db and restarting the server.")


if __name__ == "__main__":
    init_demo_data()
