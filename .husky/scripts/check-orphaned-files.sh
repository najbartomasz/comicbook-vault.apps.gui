#!/bin/sh
# Checks for orphaned files in the codebase

echo "🔍 Checking for orphaned files..."

output=$(npm run analyze:orphans --silent)

if echo "$output" | grep -q "Orphan modules:"; then
  echo "❌ Orphaned files detected!"
  echo "$output"
  exit 1
fi

echo "✅ No orphaned files found"
