#!/bin/bash

echo "========================================"
echo "  Starting Cardiac Pathology Detection App"
echo "========================================"
echo

# Determine Python command
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo "Starting backend server..."
$PYTHON_CMD model_integration.py &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5174"
echo
echo "The application will open in your browser shortly."
echo

sleep 5

# Try to open browser (works on most Linux distributions and macOS)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5174
elif command -v open &> /dev/null; then
    open http://localhost:5174
else
    echo "Please open http://localhost:5174 in your browser"
fi

echo
echo "Press Ctrl+C to stop both servers"
echo

# Wait for user to stop the servers
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

wait
