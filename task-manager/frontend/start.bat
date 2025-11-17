@echo off
REM TaskHub Frontend Server Script for Windows

echo.
echo 🚀 TaskHub Frontend Server
echo ===========================
echo.

cd /d "%~dp0"

echo 📂 Serving frontend from http://localhost:8000
echo 💡 Backend should be running on http://localhost:5000
echo Press CTRL+C to stop the server
echo.

python -m http.server 8000
pause
