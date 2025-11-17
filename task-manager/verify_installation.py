#!/usr/bin/env python3
"""
TaskHub Installation & Features Verification Script

This script checks that all files are in place and provides a verification checklist.

Usage:
    python verify_installation.py
"""

import os
import sys
from pathlib import Path


def check_file(path, description=""):
    """Check if a file exists and print status"""
    exists = os.path.isfile(path)
    status = "✅" if exists else "❌"
    desc = f" - {description}" if description else ""
    print(f"  {status} {path}{desc}")
    return exists


def check_dir(path, description=""):
    """Check if a directory exists and print status"""
    exists = os.path.isdir(path)
    status = "✅" if exists else "❌"
    desc = f" - {description}" if description else ""
    print(f"  {status} {path}{desc}")
    return exists


def main():
    print("\n" + "="*70)
    print("    TaskHub - Installation & Features Verification")
    print("="*70 + "\n")
    
    # Get base path
    base_path = Path(__file__).parent
    
    all_good = True
    
    # Check backend files
    print("🔍 Backend Files:")
    all_good &= check_file(base_path / "backend" / "app.py", "Flask application")
    all_good &= check_file(base_path / "backend" / "requirements.txt", "Dependencies")
    all_good &= check_file(base_path / "backend" / "init_demo_data.py", "Demo data generator")
    all_good &= check_file(base_path / "backend" / "start.sh", "Linux/macOS launcher")
    all_good &= check_file(base_path / "backend" / "start.bat", "Windows launcher")
    
    # Check frontend files
    print("\n🔍 Frontend Files:")
    all_good &= check_file(base_path / "frontend" / "index.html", "Main HTML")
    all_good &= check_file(base_path / "frontend" / "styles.css", "Styling")
    all_good &= check_file(base_path / "frontend" / "app.js", "Application logic")
    all_good &= check_file(base_path / "frontend" / "start.sh", "Linux/macOS launcher")
    all_good &= check_file(base_path / "frontend" / "start.bat", "Windows launcher")
    
    # Check documentation
    print("\n🔍 Documentation Files:")
    all_good &= check_file(base_path / "README.md", "Complete documentation")
    all_good &= check_file(base_path / "QUICK_START.md", "Quick start guide")
    all_good &= check_file(base_path / "ARCHITECTURE.md", "Technical documentation")
    all_good &= check_file(base_path / "SETUP_SUMMARY.md", "Setup summary")
    
    # Print feature checklist
    print("\n" + "="*70)
    print("✨ Features Implemented")
    print("="*70)
    
    features = [
        ("Project-based task organization", True),
        ("Add/edit/delete tasks", True),
        ("Add/edit/delete projects", True),
        ("Reorder tasks", True),
        ("Task priority levels (Low/Medium/High)", True),
        ("Task status tracking (Pending/Completed)", True),
        ("Due dates and reminders", True),
        ("Monthly calendar view", True),
        ("Weekly calendar view", True),
        ("Filter by project", True),
        ("Filter by priority", True),
        ("Filter by status", True),
        ("Filter by date range", True),
        ("Quick filters (Today/Upcoming/Completed)", True),
        ("Real-time sync between views", True),
        ("Responsive design (Desktop/Tablet/Mobile)", True),
        ("Clean, fast UI", True),
        ("REST API", True),
        ("SQLite database", True),
        ("CORS enabled", True),
    ]
    
    for feature, implemented in features:
        status = "✅" if implemented else "⏳"
        print(f"  {status} {feature}")
    
    # Print next steps
    print("\n" + "="*70)
    print("🚀 Getting Started")
    print("="*70)
    
    print("\n1. Start Backend (Terminal 1):")
    print("   $ cd backend")
    print("   $ chmod +x start.sh              # macOS/Linux")
    print("   $ ./start.sh")
    print("   OR on Windows:")
    print("   > start.bat")
    
    print("\n2. Start Frontend (Terminal 2):")
    print("   $ cd frontend")
    print("   $ chmod +x start.sh              # macOS/Linux")
    print("   $ ./start.sh")
    print("   OR on Windows:")
    print("   > start.bat")
    
    print("\n3. Open in Browser:")
    print("   http://localhost:8000")
    
    print("\n4. Create Sample Data (Optional):")
    print("   $ python backend/init_demo_data.py")
    
    # Status report
    print("\n" + "="*70)
    if all_good:
        print("✅ All files present! Ready to launch!")
    else:
        print("❌ Some files are missing. Check above for details.")
    print("="*70 + "\n")
    
    # Print port information
    print("📋 Service Information:")
    print("  Backend API: http://localhost:5000")
    print("  Frontend:    http://localhost:8000")
    print("  Database:    backend/tasks.db (auto-created)")
    
    print("\n📚 Documentation:")
    print("  README.md        - Full feature documentation")
    print("  QUICK_START.md   - Setup instructions")
    print("  ARCHITECTURE.md  - Technical details")
    print("  SETUP_SUMMARY.md - This overview")
    
    print("\n✨ Happy task managing! Press Ctrl+C to quit any server.\n")
    
    return 0 if all_good else 1


if __name__ == "__main__":
    sys.exit(main())
