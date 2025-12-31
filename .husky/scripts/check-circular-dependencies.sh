#!/bin/sh
# Checks for circular dependencies in the codebase

echo "🔍 Checking for circular dependencies..."

output=$(npm run analyze:deps --silent 2>&1)

if echo "$output" | grep -qE "Circular dependency|✖ Circular"; then
  echo "❌ Circular dependencies detected!"
  echo "$output"
  exit 1
fi

warnings=$(echo "$output" | grep -E "^(@|[a-z])" | grep -vE "^(@angular/|vitest/|@testing/)")

if [ -n "$warnings" ]; then
  echo "❌ Unexpected module resolution warnings detected!"
  echo "$warnings"
  exit 1
fi

echo "✅ No circular dependencies found"
