#!/bin/sh
# Updates dependency graphs if structural changes are detected

. "$(dirname "$0")/helpers/has-uncommitted-changes.sh"

remote_branch="origin/$(git rev-parse --abbrev-ref HEAD)"

# Skip if remote branch doesn't exist or no structural changes
if ! git rev-parse --verify "$remote_branch" >/dev/null 2>&1; then
  exit 0
fi

if ! git diff --name-status "$remote_branch"...HEAD | grep -qE '^(A|D|R)'; then
  exit 0
fi

echo "📊 Updating dependency graphs..."

echo "  → Module dependencies overview..."
npm run visualize:modules --silent

echo "  → Architectural layers visualization..."
npm run visualize:layers --silent

if has_uncommitted_changes "docs/module-dependencies.svg" "docs/architecture-layers.svg"; then
  echo "❌ Dependency graphs have changed!"
  echo "   Please review and commit them:"
  echo "   git add docs/module-dependencies.svg docs/architecture-layers.svg"
  echo "   git commit --amend --no-edit"
  exit 1
fi

echo "✅ Dependency graphs are up to date"
