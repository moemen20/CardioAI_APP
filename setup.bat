@echo off
echo ========================================
echo   Cardiac Pathology Detection App
echo   Quick Setup Script for Windows
echo ========================================
echo.

echo Checking prerequisites...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
    node --version
)

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please download and install Python from: https://python.org/
    echo Then run this script again.
    pause
    exit /b 1
) else (
    echo [OK] Python is installed
    python --version
)

echo.
echo Installing dependencies...
echo.

:: Install Node.js dependencies
echo Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo [OK] Node.js dependencies installed

:: Install Python dependencies
echo Installing Python dependencies...
pip install flask flask-cors pillow numpy
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    echo Trying with pip3...
    pip3 install flask flask-cors pillow numpy
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Python dependencies with pip3
        pause
        exit /b 1
    )
)
echo [OK] Python dependencies installed

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To run the application:
echo 1. Open two command prompt windows
echo 2. In the first window, run: python model_integration.py
echo 3. In the second window, run: npm run dev
echo 4. Open your browser to: http://localhost:5174
echo.
echo Or simply run: start_app.bat
echo.
pause
