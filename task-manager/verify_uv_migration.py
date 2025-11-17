#!/usr/bin/env python3
"""
uv Migration Verification Script

Verifies that all files have been properly updated to use uv.
"""

import os
import sys
from pathlib import Path


def check_file_contains(path, search_string, description=""):
    """Check if a file contains a specific string"""
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            found = search_string in content
            status = "✅" if found else "❌"
            desc = f" - {description}" if description else ""
            print(f"  {status} {path}{desc}")
            return found
    except Exception as e:
        print(f"  ❌ {path} - Error: {e}")
        return False


def main():
    print("\n" + "="*70)
    print("    TaskHub - uv Migration Verification")
    print("="*70 + "\n")
    
    base_path = Path(__file__).parent
    all_good = True
    
    # Check backend files
    print("🔍 Backend Files:")
    all_good &= check_file_contains(
        base_path / "backend" / "start.sh",
        "uv run python app.py",
        "Uses uv for startup"
    )
    all_good &= check_file_contains(
        base_path / "backend" / "start.bat",
        "uv run python app.py",
        "Windows uses uv for startup"
    )
    all_good &= check_file_contains(
        base_path / "backend" / "start.sh",
        "uv --version",
        "Checks for uv installation"
    )
    all_good &= check_file_contains(
        base_path / "backend" / "pyproject.toml",
        "Flask==2.3.3",
        "pyproject.toml has dependencies"
    )
    all_good &= check_file_contains(
        base_path / "backend" / "pyproject.toml",
        "[tool.uv]",
        "pyproject.toml has uv configuration"
    )
    
    # Check documentation
    print("\n🔍 Documentation:")
    all_good &= check_file_contains(
        base_path / "QUICK_START.md",
        "curl -LsSf https://astral.sh/uv/install.sh",
        "Quick start mentions uv"
    )
    all_good &= check_file_contains(
        base_path / "README.md",
        "uv run python app.py",
        "README updated for uv"
    )
    all_good &= check_file_contains(
        base_path / "UV_MIGRATION.md",
        "uv Migration Complete",
        "Migration guide exists"
    )
    
    # Summary
    print("\n" + "="*70)
    if all_good:
        print("✅ All files properly updated for uv!")
        print("\nNext steps:")
        print("  1. Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh")
        print("  2. Run backend: cd task-manager/backend && ./start.sh")
        print("  3. Run frontend: cd task-manager/frontend && ./start.sh")
        print("  4. Open: http://localhost:8000")
    else:
        print("❌ Some files need attention. Check above for details.")
    print("="*70 + "\n")
    
    return 0 if all_good else 1


if __name__ == "__main__":
    sys.exit(main())
