#!/bin/bash
# Docker build script

echo "Building Docker image..."
docker build -t jarvis-ai-backend:latest .

echo "✓ Image built successfully!"
echo ""
echo "To run:"
echo "  docker run -p 3000:3000 jarvis-ai-backend:latest"
