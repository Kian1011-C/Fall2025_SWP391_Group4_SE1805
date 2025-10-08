@echo off
chcp 65001 >nul
echo.
echo ================================================
echo   UPLOADING TO GITHUB
echo ================================================
echo.

echo [1/7] Initializing Git repository...
git init

echo.
echo [2/7] Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/chstrg2208/ev-battery-swap-system.git

echo.
echo [3/7] Setting default branch to main...
git branch -M main

echo.
echo [4/7] Adding all files...
git add .

echo.
echo [5/7] Committing changes...
git commit -m "Upload EV Battery Swap System - Frontend (SWP222) + Backend (EvDrivers)"

echo.
echo [6/7] Pushing to GitHub...
echo NOTE: You may need to enter your GitHub credentials
echo       Use Personal Access Token instead of password
echo.
git push -u origin main --force

echo.
echo ================================================
echo   ✅ UPLOAD COMPLETE!
echo ================================================
echo.
echo Repository: https://github.com/chstrg2208/ev-battery-swap-system
echo.
pause
