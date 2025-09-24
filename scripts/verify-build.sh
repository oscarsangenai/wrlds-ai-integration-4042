#!/bin/bash
set -euo pipefail

echo "🔍 WRLDS Build Verification Script"
echo "=================================="

# Install dependencies
echo "📦 Installing dependencies..."
pnpm i --frozen-lockfile

# Type check
echo "🔍 Running type checks..."
pnpm -s tsc --noEmit

# Lint check
echo "📋 Running lint checks..."
pnpm -s eslint . --max-warnings=0

# Build
echo "🏗️ Building project..."
pnpm -s build

# Corruption check
echo "🔍 Checking for ellipses corruption in strings..."
if rg -n "[\"'].*\.\.\..*[\"']" src public 2>/dev/null; then
  echo "❌ Ellipses found inside strings/identifiers" >&2
  exit 1
else
  echo "✅ No corruption found"
fi

# Bundle size check
echo "📊 Checking bundle sizes..."
if command -v size-limit >/dev/null 2>&1; then
  pnpm -s dlx size-limit
else
  echo "⚠️ size-limit not available, skipping bundle size check"
fi

# Build artifacts check
echo "📁 Checking build artifacts..."
if [ -d "dist" ]; then
  echo "✅ Build directory exists"
  ls -la dist/assets/ | head -10
else
  echo "❌ Build directory not found"
  exit 1
fi

echo ""
echo "✅ All verification checks passed!"
echo "🎉 Build is ready for deployment"