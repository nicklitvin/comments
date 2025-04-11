#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
cd web && npm install && cd ../server && npm install && cd ..

# Configure environment variables
echo "Setting up environment variables..."
touch server/.env
echo "LISTEN_PORT=3000" >> server/.env
echo "WEB_IP=http://localhost:5173" >> server/.env

touch web/.env
echo "VITE_API_URL=\"http://localhost:3000/api\"" > web/.env

# Run database migrations and inserting data
echo "Running database migrations..."
cd server && npm run db && npm start -- -i

# Build the web application
echo "Building the web application..."
cd ../web && npm run build

# Final instructions
echo "========================="
echo "Navigate to http://localhost:3000 to access the application."
echo "========================="
cd ../server && npm start -- -b