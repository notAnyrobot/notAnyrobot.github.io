#!/bin/bash

# TaskHub Quick Start Script for Linux/macOS (using uv)

echo "🚀 TaskHub Quick Start (uv)"
echo "============================="
echo ""

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed."
    echo "Install it with: curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo "Or visit: https://github.com/astral-sh/uv"
    exit 1
fi

echo "✅ uv found: $(uv --version)"
echo ""

# Backend setup
echo "📦 Setting up backend with uv..."
cd "$(dirname "$0")"

# Sync dependencies and run
echo "Installing dependencies and starting server..."
uv run python app.py
