@echo off
echo ========================================
echo   Portfolio - Iniciando servidor...
echo   Acesse: http://127.0.0.1:8000
echo   Ctrl+C para parar
echo ========================================
call venv\Scripts\activate
python manage.py runserver
pause
