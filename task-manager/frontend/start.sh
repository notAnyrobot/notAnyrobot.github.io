#!/bin/bash

# TaskHub Frontend Server Script for Linux/macOS

echo "🚀 TaskHub Frontend Server"
echo "==========================="
echo ""

cd "$(dirname "$0")"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed."
    exit 1
fi

echo "📂 Serving frontend from http://localhost:8000"
echo "💡 Backend should be running on http://localhost:5000"
echo "Press CTRL+C to stop the server"
echo ""

python3 -m http.server 8000
