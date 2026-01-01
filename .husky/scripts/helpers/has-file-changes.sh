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
    # Pre-push context: read push info from stdin and check commits being pushed
    while read local_ref local_sha remote_ref remote_sha; do
      range="${remote_sha}..${local_sha}"
      git diff --name-only "$range" 2>/dev/null | grep -q "$pattern" && return 0
    done
    return 1
  fi
}
