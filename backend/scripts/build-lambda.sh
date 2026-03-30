#!/bin/bash

# Build script for AWS Lambda deployment
set -e

echo "🏗️  Building Lambda package..."

# Clean previous builds
rm -rf dist lambda-deployment.zip

# Compile TypeScript
echo "📦 Compiling TypeScript..."
pnpm build

# Copy node_modules to dist (only production dependencies)
echo "📦 Installing production dependencies..."
cp package.json dist/
cd dist
npm install --production --omit=dev
cd ..

# Copy JSON schemas to dist
echo "📦 Copying JSON schemas..."
mkdir -p dist/services/data
cp src/services/data/*.json dist/services/data/

echo "✅ Lambda package built successfully in dist/"
echo "📍 Ready for Terraform deployment"
