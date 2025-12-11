@echo off
REM Development Docker setup script for Windows

echo 🐳 Starting Leave Management System in Docker...

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down

REM Build and start containers
echo Building and starting containers...
docker-compose up --build -d

REM Wait for database to be ready
echo Waiting for database to be ready...
timeout /t 10 /nobreak > nul

REM Show container status
echo Container status:
docker-compose ps

REM Show logs
echo Application logs:
docker-compose logs app

echo ✅ Setup complete!
echo 🌐 Backend API: http://localhost:3002
echo 🗄️  Database: localhost:3306
echo.
echo Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop: docker-compose down
echo   Restart: docker-compose restart