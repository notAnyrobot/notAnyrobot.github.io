@echo off
REM TaskHub Quick Start Script for Windows (using uv)

echo.
echo 🚀 TaskHub Quick Start (uv)
echo =============================
echo.

REM Check if uv is installed
uv --version >nul 2>&1
if errorlevel 1 (
    echo ❌ uv is not installed.
    echo Install it with: powershell -ExecutionPolicy BypassUser -c "irm https://astral.sh/uv/install.ps1 | iex"
    echo Or visit: https://github.com/astral-sh/uv
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('uv --version') do echo ✅ uv found: %%i
echo.

REM Backend setup
echo 📦 Setting up backend with uv...
cd /d "%~dp0"

REM Install dependencies and run
echo Installing dependencies and starting server...
uv run python app.py
pause
