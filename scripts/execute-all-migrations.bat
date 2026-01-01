@echo off
REM ==========================================
REM Script d'exécution complète de la migration PostgreSQL (Windows)
REM Exécute tous les dumps SQL dans le bon ordre
REM ==========================================

SET PG_HOST=localhost
SET PG_PORT=5432
SET PG_DATABASE=peva_greenhub
SET PG_USER=postgres

SET DOCS_DIR=%~dp0..\docs

echo ========================================== Migration PostgreSQL - PEVA vers 2iE GreenHub
echo ==================================================
echo Host: %PG_HOST%:%PG_PORT%
echo Database: %PG_DATABASE%
echo User: %PG_USER%
echo.

REM Confirmation
set /p confirm="Etes-vous sur de vouloir executer la migration? (y/N): "
if /i not "%confirm%"=="y" (
    echo Migration annulee.
    exit /b 0
)

echo.
echo Demarrage de la migration...
echo.

REM 1. Schema principal (37 tables)
echo Schema principal (37 tables, 8 ENUMs, triggers, fonctions)
psql -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE% -f "%DOCS_DIR%\POSTGRESQL_SELF_HOSTED_DUMP.sql"
if errorlevel 1 goto error
echo    OK
echo.

REM 2. Auth & Storage (7 tables)
echo Auth ^& Storage (7 tables complementaires)
psql -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE% -f "%DOCS_DIR%\POSTGRESQL_MIGRATION_AUTH_STORAGE.sql"
if errorlevel 1 goto error
echo    OK
echo.

REM 3. Buckets (7 buckets)
echo Buckets de stockage (7 buckets PEVA)
psql -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE% -f "%DOCS_DIR%\POSTGRESQL_BUCKETS_PEVA_ONLY.sql"
if errorlevel 1 goto error
echo    OK
echo.

REM 4. RLS & Policies (CRITIQUE)
echo RLS ^& Policies de securite (CRITIQUE)
psql -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE% -f "%DOCS_DIR%\POSTGRESQL_RLS_POLICIES.sql"
if errorlevel 1 goto error
echo    OK
echo.

echo ==================================================
echo Migration terminee avec succes!
echo.
echo Pour tester la migration, executez:
echo    node scripts\test-migration-postgresql.js
echo ==================================================
exit /b 0

:error
echo    ECHEC
echo Migration interrompue suite a une erreur.
exit /b 1
