#!/bin/sh
# Syncs version from package.json to sonar-project.properties

if git diff --cached --name-only | grep -q "package.json"; then
  echo "🔄 Syncing Sonar project version..."

  VERSION=$(node -p "require('./package.json').version")
  sed -i "s/^sonar.projectVersion=.*/sonar.projectVersion=$VERSION/" sonar-project.properties

  if ! git diff --quiet sonar-project.properties; then
    echo "❌ Sonar project version has changed. Please review and add it:"
    echo "   git add sonar-project.properties"
    echo "   git commit --amend --no-edit"
    exit 1
  fi

  echo "✅ Sonar project version is up to date"
fi
