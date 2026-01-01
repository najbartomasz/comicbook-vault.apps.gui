#!/bin/sh
# Helper function to check if files have uncommitted changes
# Returns 0 (true) if files have changes, 1 (false) if clean
# Usage: has_uncommitted_changes "file1" "file2" ...
# Example: has_uncommitted_changes "docs/ARCHITECTURE.md"

has_uncommitted_changes() {
  files="$*"
  ! git diff --quiet $files 2>/dev/null
}
