#!/bin/bash

# Script to build Docker image and test the Next.js web client

set -e  # Exit on any error

# Configuration
IMAGE_NAME="szeyap-web-client"
CONTAINER_NAME="szeyap-web-client-test"
PORT=3000
BASE_URL="http://localhost:${PORT}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cleanup() {
    print_status "Cleaning up..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
}

# Set up cleanup trap
trap cleanup EXIT

print_status "Starting Docker build and test process for Next.js web client..."

# Step 1: Build the Docker image
print_status "Building Docker image: $IMAGE_NAME"
if docker build -t $IMAGE_NAME .; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Step 2: Run the container
print_status "Starting container: $CONTAINER_NAME on port $PORT"
if docker run -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME; then
    print_success "Container started successfully"
else
    print_error "Failed to start container"
    exit 1
fi

# Step 3: Wait for the service to be ready
print_status "Waiting for Next.js application to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s -f "$BASE_URL" > /dev/null 2>&1; then
        print_success "Next.js application is ready!"
        break
    fi
    
    attempt=$((attempt + 1))
    print_status "Attempt $attempt/$max_attempts - waiting for application..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    print_error "Application failed to start within expected time"
    print_status "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Step 4: Test the application
print_status "Testing Next.js application..."

# Test 1: Homepage
print_status "Testing homepage..."
response_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$response_code" = "200" ]; then
    print_success "✓ Homepage is accessible (HTTP $response_code)"
else
    print_warning "⚠ Homepage returned HTTP $response_code"
fi

# Test 2: Check if it's actually serving HTML
print_status "Checking HTML content..."
html_content=$(curl -s "$BASE_URL")
if echo "$html_content" | grep -q "<!DOCTYPE html>"; then
    print_success "✓ Application is serving HTML content"
else
    print_warning "⚠ Response doesn't appear to be HTML"
fi

# Test 3: Check for Next.js specific content
if echo "$html_content" | grep -q -E "(next|Next\.js|__NEXT_DATA__|_next)"; then
    print_success "✓ Next.js application detected"
else
    print_warning "⚠ Next.js specific content not detected"
fi

print_success "All tests completed!"
print_status "Application is running at: $BASE_URL"

# Keep container running for manual testing (optional)
read -p "Press Enter to stop the container and cleanup, or Ctrl+C to keep it running..."

print_success "Docker build and test completed successfully!"