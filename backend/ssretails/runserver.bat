@echo off
cd /d "%~dp0"
echo Starting SSRetails Backend Server...
python manage.py runserver
pause

