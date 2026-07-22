@echo off
chcp 65001 >nul
title NovaForge NEX - Fase A (Buscar + Stock)
cd /d "%~dp0"

echo.
echo  ========================================
echo   NEX FASE A — Buscar + Mi stock
echo   (contraseña: pedir al autor)
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

echo  Compilando demo...
call npm run build
if errorlevel 1 (
    echo  ERROR: build fallo.
    pause
    exit /b 1
)

if not exist "dist\index.html" (
    echo  ERROR: No se genero dist\index.html
    pause
    exit /b 1
)

echo  Liberando puerto 3000 (si hay servidor viejo)...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%p >nul 2>&1
)

echo  Iniciando servidor Fase A (NO la maqueta)...
start "Servidor NEX Fase A" cmd /k "cd /d "%~dp0" && npx --yes serve dist -l 3000 --no-port-switching"

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  Listo: http://localhost:3000
echo  Portafolio NEX completo: http://localhost:3000/portfolio/
echo  Cierra la ventana del servidor para detenerlo.
echo.
pause
