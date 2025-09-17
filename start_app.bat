@echo off
echo ========================================
echo   Starting Cardiac Pathology Detection App
echo ========================================
echo.

echo Starting backend server...
start "Backend Server" cmd /k "python model_integration.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5174
echo.
echo The application will open in your browser shortly.
echo.

timeout /t 5 /nobreak >nul
start http://localhost:5174

echo.
echo To stop the servers, close both command prompt windows.
echo.
pause
