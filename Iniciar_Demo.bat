@echo off
chcp 65001 >nul
title NovaForge NEX - Demo Portafolio
cd /d "%~dp0"

echo.
echo  ========================================
echo   NOVAFORGE NEX - DEMO PORTAFOLIO
echo   (datos ficticios)
echo  ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  ERROR: Node.js no esta instalado.
    echo  Descarga: https://nodejs.org
    echo.
    pause
    exit /b 1
)

if not exist "dist\index.html" (
    echo  ERROR: No se encontro dist\index.html
    echo.
    pause
    exit /b 1
)

echo  Iniciando servidor...
start "Servidor NovaForge NEX" cmd /k "cd /d "%~dp0" && npx --yes serve dist -l 3000"

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  Listo: http://localhost:3000
echo  Cierra la ventana del servidor para detenerlo.
echo.
pause
