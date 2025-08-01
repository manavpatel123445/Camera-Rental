#!/bin/bash

# Install dependencies for the root project
npm install

# Build backend
cd backend
npm install
npm run build
cd ..

# Build frontend
cd frontend
npm install
npm run build
cd ..

echo "Build completed successfully!" 