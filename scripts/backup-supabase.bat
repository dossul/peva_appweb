@echo off
REM ==========================================
REM Script de backup automatique Supabase
REM Crée un export SQL horodaté
REM ==========================================

SET BACKUP_DIR=%~dp0..\backups
SET TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
SET TIMESTAMP=%TIMESTAMP: =0%

REM Créer le dossier backups s'il n'existe pas
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo ========================================== Backup Supabase Self-Hosted
echo ==================================================
echo Destination: %BACKUP_DIR%
echo Timestamp: %TIMESTAMP%
echo.

REM Exécuter l'export
node %~dp0export-supabase-to-sql.js --output=backup-%TIMESTAMP%.sql

if errorlevel 1 (
    echo.
    echo ❌ Backup echoue
    pause
    exit /b 1
)

REM Déplacer le backup dans le dossier backups
move "%~dp0..\docs\backup-%TIMESTAMP%.sql" "%BACKUP_DIR%\"

echo.
echo ========================================== Backup termine avec succes!
echo ==================================================
echo Fichier: %BACKUP_DIR%\backup-%TIMESTAMP%.sql
echo ==================================================

REM Optionnel: Nettoyer les anciens backups (garder 30 derniers jours)
REM forfiles /p "%BACKUP_DIR%" /m backup-*.sql /d -30 /c "cmd /c del @path"

pause
