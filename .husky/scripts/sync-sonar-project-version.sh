#!/bin/sh
# Syncs version from package.json to sonar-project.properties

. "$(dirname "$0")/helpers/has-file-changes.sh"
. "$(dirname "$0")/helpers/has-uncommitted-changes.sh"

if has_file_changes "package.json"; then
  echo "🔄 Syncing Sonar project version..."

  VERSION=$(node -p "require('./package.json').version")
  sed -i "s/^sonar.projectVersion=.*/sonar.projectVersion=$VERSION/" sonar-project.properties

  if has_uncommitted_changes "sonar-project.properties"; then
    echo "❌ Sonar project version has changed!"
    echo "   Please review and commit changes:"
    echo "   git add sonar-project.properties"
    echo "   git commit --amend --no-edit"
    exit 1
  fi

  echo "✅ Sonar project version is up to date"
fi
