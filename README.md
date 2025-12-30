# ComicBook Vault

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=coverage)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=bugs)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=najbartomasz_comicbook-vault.apps.gui&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=najbartomasz_comicbook-vault.apps.gui)

## 📐 Architecture

This project follows a **layered architecture** with strict separation between framework-agnostic business logic and framework-specific presentation code.

📖 **[Read the Architecture Guide →](docs/ARCHITECTURE.md)**

---

## 🚀 Getting Started

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application automatically reloads when you modify source files.

### Build

```bash
npm run build
```

Build artifacts are stored in the `dist/` directory.

---

## 🧪 Testing

### Unit Tests

```bash
npm test                   # Run all tests
npm run test:unit          # Run unit tests only
npm run test:unit:visual   # Run visual regression tests
```

### Linting

```bash
npm run lint               # Check code and styles
npm run lint:fix           # Auto-fix issues
npm run lint:styles        # Check styles only
npm run lint:styles:fix    # Auto-fix style issues
```

---

## 📊 Code Analysis

### Dependency Analysis

```bash
npm run analyze:deps       # Check for circular dependencies
npm run analyze:orphans    # Find orphaned modules
npm run visualize:modules  # Generate module dependency graph
npm run visualize:layers   # Generate architecture layers visualization
npm run docs:metrics       # Update architecture metrics
npm run docs:validate      # Run all analysis and update documentation
```

### Coverage Reports

Test coverage reports are generated in the `coverage/` directory.

**Detailed Dependency Analysis**: See [Architecture Guide](docs/ARCHITECTURE.md#dependency-analysis) for detailed graphs and explanations.

---

## 🎣 Git Hooks & Automation

### Pre-Commit Hook
When committing changes to `src/app/`:
- Automatically updates architecture metrics in `docs/ARCHITECTURE.md`
- **Aborts commit if changes detected** - you must review and add them:
  ```bash
  git add docs/ARCHITECTURE.md
  git commit --amend --no-edit
  ```

### Pre-Push Hook
When pushing commits with structural changes (add/delete/rename files):
- Automatically generates dependency graphs (`module-dependencies.svg`, `architecture-layers.svg`)
- **Aborts push if graphs changed** - you must review and commit them:
  ```bash
  git add docs/module-dependencies.svg docs/architecture-layers.svg
  git commit -m 'docs: update dependency graphs'
  git push
  ```
- Validates architecture constraints (no circular dependencies, no orphaned files)

---

## 🛠️ Tech Stack

- **Framework**: Angular 21 (Zoneless) + Angular Material
- **SSR**: Angular Server-Side Rendering with Express
- **Language**: TypeScript 5.9
- **Testing**: Vitest 4 + Angular Testing Library + Playwright
- **Code Quality**: ESLint 9, Stylelint, SonarCloud
- **Architecture Analysis**: Dependency Cruiser, Madge
- **Git Hooks**: Husky
- **Architecture**: Layered architecture with framework-agnostic core

---

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - Detailed architecture principles and patterns
- [Architecture Draft](docs/ARCHITECTURE-DRAFT.md) - Future architecture considerations
