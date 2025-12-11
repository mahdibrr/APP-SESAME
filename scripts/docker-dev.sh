#!/bin/bash

# Development Docker setup script

echo "🐳 Starting Leave Management System in Docker..."

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Show container status
echo "Container status:"
docker-compose ps

# Show logs
echo "Application logs:"
docker-compose logs app

echo "✅ Setup complete!"
echo "🌐 Backend API: http://localhost:3002"
echo "🗄️  Database: localhost:3306"
echo ""
echo "Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"