#!/bin/bash

echo "========================================"
echo "  Cardiac Pathology Detection App"
echo "  Quick Setup Script for Linux/macOS"
echo "========================================"
echo

echo "Checking prerequisites..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    echo "Then run this script again."
    exit 1
else
    echo "[OK] Node.js is installed"
    node --version
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[ERROR] Python is not installed!"
    echo "Please download and install Python from: https://python.org/"
    echo "Then run this script again."
    exit 1
else
    echo "[OK] Python is installed"
    if command -v python3 &> /dev/null; then
        python3 --version
        PYTHON_CMD="python3"
        PIP_CMD="pip3"
    else
        python --version
        PYTHON_CMD="python"
        PIP_CMD="pip"
    fi
fi

echo
echo "Installing dependencies..."
echo

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Node.js dependencies"
    exit 1
fi
echo "[OK] Node.js dependencies installed"

# Install Python dependencies
echo "Installing Python dependencies..."
$PIP_CMD install flask flask-cors pillow numpy
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Python dependencies"
    echo "You might need to use sudo or create a virtual environment"
    echo "Try: sudo $PIP_CMD install flask flask-cors pillow numpy"
    exit 1
fi
echo "[OK] Python dependencies installed"

echo
echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo
echo "To run the application:"
echo "1. Open two terminal windows"
echo "2. In the first terminal, run: $PYTHON_CMD model_integration.py"
echo "3. In the second terminal, run: npm run dev"
echo "4. Open your browser to: http://localhost:5174"
echo
echo "Or simply run: ./start_app.sh"
echo

# Make start_app.sh executable
chmod +x start_app.sh 2>/dev/null || true
