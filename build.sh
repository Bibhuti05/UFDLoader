#!/bin/bash

# Build script for ufdloader cross-platform executables

echo "Building ufdloader executables..."

# Clean previous builds
rm -rf dist
mkdir -p dist

# Build for Linux
echo "Building for Linux..."
bun build --compile --target=bun-linux-x64 index.ts --outfile dist/ufdloader-linux

# Build for macOS (Intel)
echo "Building for macOS (Intel)..."
bun build --compile --target=bun-darwin-x64 index.ts --outfile dist/ufdloader-mac

# Build for macOS (Apple Silicon)
echo "Building for macOS (Apple Silicon)..."
bun build --compile --target=bun-darwin-arm64 index.ts --outfile dist/ufdloader-mac-arm64

# Build for Windows
echo "Building for Windows..."
bun build --compile --target=bun-windows-x64 index.ts --outfile dist/ufdloader-windows.exe

echo "Build complete! Executables are in the 'dist' folder:"
echo "  - dist/ufdloader-linux (Linux x64)"
echo "  - dist/ufdloader-mac (macOS Intel)"
echo "  - dist/ufdloader-mac-arm64 (macOS Apple Silicon)"
echo "  - dist/ufdloader-windows.exe (Windows x64)"

# Make executables executable
chmod +x dist/ufdloader-linux
chmod +x dist/ufdloader-mac
chmod +x dist/ufdloader-mac-arm64