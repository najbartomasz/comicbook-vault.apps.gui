#!/bin/sh
# Helper function to check if specific files changed in commits (pre-push) or staged (pre-commit)
# Usage: has_file_changes "pattern"
# Example: has_file_changes "^src/app/" or has_file_changes "package.json"

has_file_changes() {
  pattern="$1"

  # Detect which Git hook is calling this script:
  # - Pre-commit: Git doesn't pipe data → stdin is terminal → [ -t 0 ] = true
  # - Pre-push: Git pipes push info to stdin → [ -t 0 ] = false
  if [ -t 0 ]; then
    # Pre-commit context: check currently staged files
    git diff --cached --name-only | grep -q "$pattern"
  else
    # Pre-push context: check commits being pushed
    # Get the current branch and its remote tracking branch
    current_branch=$(git symbolic-ref --short HEAD)
    remote_branch="origin/$current_branch"

    # Check if remote branch exists
    if git rev-parse --verify "$remote_branch" >/dev/null 2>&1; then
      # Compare with remote branch
      git diff --name-only "$remote_branch"...HEAD 2>/dev/null | grep -q "$pattern"
    else
      # No remote branch exists, check all commits
      git log --name-only --pretty=format: HEAD | grep -q "$pattern"
    fi
  fi
}
