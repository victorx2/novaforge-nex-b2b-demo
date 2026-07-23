@echo off
chcp 65001 >nul
title Repuestia
cd /d "%~dp0"

echo.
echo  ========================================
echo   Repuestia — directorio automotriz
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

if not exist "node_modules\" (
    echo  Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo  ERROR: npm install fallo.
        pause
        exit /b 1
    )
)

echo  Compilando...
call npm run build
if errorlevel 1 (
    echo  ERROR: build fallo.
    pause
    exit /b 1
)

if not exist "apps\web\dist\index.html" (
    echo  ERROR: No se genero apps\web\dist\index.html
    pause
    exit /b 1
)

echo  Liberando puerto 3000...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%p >nul 2>&1
)

echo  Iniciando servidor...
start "BuscaRepuesto" cmd /k "cd /d "%~dp0" && npm start"

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  Listo: http://localhost:3000
echo  Configura apps\web\.env con Supabase (ver README).
echo.
pause
