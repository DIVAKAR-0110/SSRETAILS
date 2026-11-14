@echo off
cd /d "%~dp0backend\ssretails"
echo Starting SSRetails Backend Server...
python manage.py runserver
pause

