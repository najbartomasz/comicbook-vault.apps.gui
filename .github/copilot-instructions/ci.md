# GitHub Actions CI Workflow Best Practices

This document outlines the conventions and best practices for editing the `ci.yaml` workflow.

## Action Pinning

- **Always use semantic version tags** (e.g., `@v4`) for better maintainability
- Do NOT add version comments after action references
- Update to newer major versions when needed for new features or breaking changes

```yaml
# ✅ Correct
uses: actions/checkout@v4

# ❌ Incorrect
uses: actions/checkout@eef61447b9ff4aafe5dcd4e0bbf5d482be7e7871
uses: actions/checkout@v4 # v4.2.1
```

## Step Naming Convention

- Use **Title Case** for all step names
- Be descriptive and action-oriented

```yaml
# ✅ Correct
- name: Install Playwright Browsers
- name: Cache Node Modules
- name: Generate Architecture Metrics

# ❌ Incorrect
- name: install playwright browsers
- name: cache node modules
```

## Caching Strategy

### Node Modules
- Cache `node_modules` directory in the `setup` job
- Use `actions/cache` to create the cache
- Use `actions/cache/restore` to restore in dependent jobs
- Cache key: `${{ runner.os }}-node-modules-${{ hashFiles('**/package-lock.json') }}`
- Only run `npm ci` if cache miss

### Playwright Browsers
- Cache Playwright browsers in the `test` job (only job that needs them)
- Cache path: `~/.cache/ms-playwright`
- Cache key: `${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}`
- On cache miss: `npx playwright install --with-deps` (browsers + system deps)
- On cache hit: `npx playwright install-deps` (only system deps)

```yaml
- name: Cache Node Modules
  id: node-modules-cache
  uses: actions/cache@v4
  with:
      path: node_modules
      key: ${{ runner.os }}-node-modules-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
          ${{ runner.os }}-node-modules-

- name: Install Dependencies
  if: steps.node-modules-cache.outputs.cache-hit != 'true'
  run: npm ci
```

## Job Structure

### Job Dependencies
- `setup` job: No dependencies, sets up caches
- `build`, `lint`, `test`, `architecture`: Depend on `setup`
- `sonarqube`: Depends on `[build, lint, test]`
- `status`: Depends on `[build, lint, test, architecture]`

### Parallel Execution
- `build`, `lint`, `test`, and `architecture` jobs run in parallel
- This maximizes CI speed
- Keep jobs independent to maintain parallelism

### Timeouts
- `setup`: 10 minutes
- `build`: 10 minutes
- `lint`: 10 minutes
- `test`: 15 minutes (needs more time for Playwright)
- `architecture`: 10 minutes
- `sonarqube`: 10 minutes
- `status`: 5 minutes

Always set appropriate timeouts to prevent hanging jobs.

## Artifact Management

### Retention Policy
- All artifacts: **2 days** retention
- Keep retention short to save storage costs
- Artifacts are for debugging recent builds only

### Upload Conditions
- Coverage reports: `if: always()` (upload even on failure)
- Visual test screenshots: `if: failure()` (only on test failures)
- Build artifacts: Always upload when job succeeds

```yaml
- name: Upload Coverage Reports
  uses: actions/upload-artifact@v4
  if: always()
  with:
      name: coverage-reports
      path: coverage/
      retention-days: 2
```

## Conditional Execution

### SonarQube Job
- Only runs on pushes to main or pull requests from the same repository
- Prevents running on external forks (security)

```yaml
if: github.event_name == 'push' || github.event.pull_request.head.repo.full_name == github.repository
```

## Architecture Validation

### Git Diff Checks
- Use `git diff --exit-code` (not `--quiet`) for better error reporting
- Use GitHub Actions error annotations: `::error title=Title::Message`
- Validate both dependency graphs and documentation are up-to-date

```yaml
if ! git diff --exit-code docs/ARCHITECTURE.md; then
  echo "::error title=Outdated Architecture Docs::Architecture metrics are out of date! Run 'npm run docs:metrics' and commit the changes."
  exit 1
fi
```

## Job Summaries

- Use `$GITHUB_STEP_SUMMARY` to create rich job summaries
- Provides visibility in GitHub Actions UI
- Use markdown for formatting
- Always add summaries to `architecture` and `status` jobs

```yaml
- name: Create Job Summary
  if: always()
  run: |
      echo "## Build Summary" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "✅ All checks passed!" >> $GITHUB_STEP_SUMMARY
```

## Concurrency Control

- Cancel in-progress runs when new commits are pushed
- Saves CI minutes and provides faster feedback

```yaml
concurrency:
    group: ${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true
```

## Node.js Setup

- Node version: **24**
- Do NOT use `cache: "npm"` in Setup Node when using custom node_modules caching
- Only use `cache: "npm"` in the `setup` job for package-lock.json caching during npm ci

## System Dependencies

- Install system dependencies (like Graphviz) in the job that needs them
- Use `sudo apt-get update && sudo apt-get install -y <package>`
- Graphviz: Required for architecture visualization in `architecture` job

## General Principles

1. **Single Responsibility**: Each job should have a clear, focused purpose
2. **Fail Fast**: Set appropriate timeouts and use strict validation
3. **Cache Everything**: Maximize caching to reduce CI time and costs
4. **Parallel by Default**: Keep jobs independent and parallel when possible
5. **Visibility**: Use job summaries and error annotations for clear feedback
6. **Security First**: Pin actions to SHAs, limit external fork execution
7. **Cost Conscious**: Short retention periods, cancel outdated runs
