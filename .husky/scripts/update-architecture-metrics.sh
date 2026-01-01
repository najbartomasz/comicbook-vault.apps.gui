#!/bin/sh
# Updates architecture metrics documentation

. "$(dirname "$0")/helpers/has-file-changes.sh"
. "$(dirname "$0")/helpers/has-uncommitted-changes.sh"

if has_file_changes "^src/app/"; then
  echo "📊 Checking architecture metrics..."

  npm run docs:metrics --silent >/dev/null 2>&1

  if has_uncommitted_changes "docs/ARCHITECTURE.md"; then
    echo "❌ Architecture metrics are out of date!"
    echo "   Please review and commit changes:"
    echo "   git add docs/ARCHITECTURE.md"
    echo "   git commit --amend --no-edit"
    exit 1
  fi

  echo "✅ Architecture metrics are up to date"
fi
