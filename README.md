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

📖 **[Read the full architecture documentation →](ARCHITECTURE.md)**

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
npm run lint           # Check code quality
npm run lint:fix       # Auto-fix issues
npm run lint:styles    # Check styles only
```

---

## 📊 Code Analysis

### Coverage Reports

Test coverage reports are generated in the `coverage/` directory.

**Dependency Analysis**: See [ARCHITECTURE.md](ARCHITECTURE.md#dependency-analysis) for detailed dependency graphs and analysis commands.

---

## 🛠️ Tech Stack

- **Framework**: Angular 21 (Zoneless)
- **Testing**: Vitest + Angular Testing Library
- **Code Quality**: ESLint, Stylelint, SonarCloud
- **Architecture**: Layered architecture with framework-agnostic core

---

##  Documentation

- [Architecture Guide](ARCHITECTURE.md) - Detailed architecture principles and patterns
- [Architecture Draft](ARCHITECTURE-DRAFT.md) - Future architecture considerations
