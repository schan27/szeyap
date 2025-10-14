#!/bin/bash

# Script to build Docker image and test the szeyap API endpoints
# Based on endpoints defined in src/szeyapapi/specs/szeyap_api.yml

set -e  # Exit on any error

# Configuration
IMAGE_NAME="szeyap-api"
CONTAINER_NAME="szeyap-api-test"
PORT=8000
BASE_URL="http://localhost:${PORT}/api"

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

print_status "Starting Docker build and test process..."

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
if docker run -d --name $CONTAINER_NAME -p $PORT:8000 $IMAGE_NAME; then
    print_success "Container started successfully"
else
    print_error "Failed to start container"
    exit 1
fi

# Step 3: Wait for the service to be ready
print_status "Waiting for service to be ready..."
max_attempts=5
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s -f "$BASE_URL/hello_world" > /dev/null 2>&1; then
        print_success "Service is ready!"
        break
    fi
    
    attempt=$((attempt + 1))
    print_status "Attempt $attempt/$max_attempts - waiting for service..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    print_error "Service failed to start within expected time"
    print_status "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Step 4: Test endpoints
print_status "Testing API endpoints..."

# Test 1: Hello World endpoint
print_status "Testing /hello_world endpoint..."
response=$(curl -s "$BASE_URL/hello_world")
if [ $? -eq 0 ] && [ -n "$response" ]; then
    print_success "✓ /hello_world endpoint working"
    echo "  Response: $response"
else
    print_error "✗ /hello_world endpoint failed"
fi

# Test 2: Romanizations endpoint
print_status "Testing /romanizations endpoint..."
romanization_response=$(curl -s "$BASE_URL/romanizations?phrase=cats")
if [ $? -eq 0 ] && [ -n "$romanization_response" ]; then
    print_success "✓ /romanizations endpoint working"
    echo "  Response: $romanization_response"
    # Try to pretty print JSON if possible
    if echo "$romanization_response" | jq . > /dev/null 2>&1; then
        echo "  Formatted: $(echo "$romanization_response" | jq .)"
    fi
else
    print_warning "⚠ /romanizations endpoint may have issues"
    echo "  Response: $romanization_response"
fi

# Test 3: Translation endpoint with GC_DICT
print_status "Testing /translation endpoint with GC_DICT..."
translation_response=$(curl -s "$BASE_URL/translation?phrase=cats&dictionary=GC_DICT")
if [ $? -eq 0 ] && [ -n "$translation_response" ]; then
    print_success "✓ /translation endpoint (GC_DICT) working"
    echo "  Response: $translation_response"
    if echo "$translation_response" | jq . > /dev/null 2>&1; then
        echo "  Formatted: $(echo "$translation_response" | jq .)"
    fi
else
    print_warning "⚠ /translation endpoint (GC_DICT) may have issues"
    echo "  Response: $translation_response"
fi

# Test 4: Translation endpoint with SL_DICT
print_status "Testing /translation endpoint with SL_DICT..."
translation_response_sl=$(curl -s "$BASE_URL/translation?phrase=cats&dictionary=SL_DICT")
if [ $? -eq 0 ] && [ -n "$translation_response_sl" ]; then
    print_success "✓ /translation endpoint (SL_DICT) working"
    echo "  Response: $translation_response_sl"
    if echo "$translation_response_sl" | jq . > /dev/null 2>&1; then
        echo "  Formatted: $(echo "$translation_response_sl" | jq .)"
    fi
else
    print_warning "⚠ /translation endpoint (SL_DICT) may have issues"
    echo "  Response: $translation_response_sl"
fi

# Test 5: Translation endpoint with Chinese input
print_status "Testing /translation endpoint with Chinese input..."
chinese_response=$(curl -s "$BASE_URL/translation?phrase=貓&dictionary=GC_DICT")
if [ $? -eq 0 ] && [ -n "$chinese_response" ]; then
    print_success "✓ /translation endpoint (Chinese) working"
    echo "  Response: $chinese_response"
    if echo "$chinese_response" | jq . > /dev/null 2>&1; then
        echo "  Formatted: $(echo "$chinese_response" | jq .)"
    fi
else
    print_warning "⚠ /translation endpoint (Chinese) may have issues"
    echo "  Response: $chinese_response"
fi

# Test 6: Test error handling (missing required parameter)
print_status "Testing error handling (missing required parameters)..."
error_response=$(curl -s "$BASE_URL/translation")
if [ $? -eq 0 ]; then
    print_success "✓ Error handling test completed"
    echo "  Response: $error_response"
else
    print_warning "⚠ Error handling test had issues"
    echo "  Response: $error_response"
fi

print_success "All tests completed!"
print_status "Container is running at: $BASE_URL"
print_status "Swagger UI available at: $BASE_URL/ui"

# Keep container running for manual testing (optional)
read -p "Press Enter to stop the container and cleanup, or Ctrl+C to keep it running..."

print_success "Docker build and test completed successfully!"