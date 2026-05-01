@echo off
echo Starting Backend...
start cmd /k "cd backend && node server.js"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Project started!
