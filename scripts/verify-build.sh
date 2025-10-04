#!/bin/bash
set -euo pipefail

echo "🔍 Running build verification..."

# Type check
echo "📝 Type checking..."
pnpm -s tsc --noEmit

# Lint
echo "🔎 Linting..."
pnpm -s eslint .

# Build
echo "🏗️  Building..."
pnpm -s build

# Check for corruption (literal ... inside strings)
echo "🔍 Checking for code corruption..."
if grep -r "[\"\'].*\.\.\..*[\"\']" src public --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | grep -v "spread" | grep -v "rest" | grep -v "\.\.\.props"; then
  echo "❌ Found suspicious ellipses in strings/identifiers" >&2
  exit 1
fi

# Size limits
echo "📊 Checking bundle sizes..."
pnpm -s size-limit

echo "✅ Build verification complete!"
