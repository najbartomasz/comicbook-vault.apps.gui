# Application Architecture

![Architecture Validated](https://img.shields.io/badge/architecture-validated-green)
![Documentation Validated](https://img.shields.io/badge/docs-validated-green)
![Dependencies](https://img.shields.io/badge/circular%20deps-0-green)
![Layer Separation](https://img.shields.io/badge/layer%20separation-strict-blue)
![Framework Agnostic](https://img.shields.io/badge/framework%20agnostic-73%25-purple)
![Angular Specific](https://img.shields.io/badge/angular%20specific-28%25-blue)
![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

## Table of Contents

- [Overview](#overview)
  - [High-Level Architecture](#high-level-architecture)
- [Project Statistics](#project-statistics)
- [Project Structure](#project-structure)
- [Architecture Principles](#architecture-principles)
  - [Layer Separation](#layer-separation)
- [Testing Strategy](#testing-strategy)
  - [Unit Tests](#unit-tests)
  - [E2E Tests](#e2e-tests)
- [Benefits](#benefits)
- [Dependency Analysis](#dependency-analysis)
  - [Dependency Graph](#dependency-graph)
  - [Analysis Commands](#analysis-commands)
  - [Automatic Validation](#automatic-validation)
- [Future Extensions](#future-extensions)

---

## Overview

This project follows a **layered architecture** with strict separation between framework-agnostic business logic and Angular-specific presentation code. The architecture ensures portability, testability, and maintainability.

### High-Level Architecture

```mermaid
flowchart TB
    subgraph Angular["Angular-Specific Layer"]
        Shell["Shell<br/>(App Component, Routes, Config)"]
        Pages["Pages<br/>(Dashboard, etc.)"]
    end

    subgraph Pure["Framework-Agnostic Layer"]
        LibCore["Lib/Core<br/>(Date-Time, Performance)"]
        LibInfra["Lib/Infrastructure<br/>(HTTP Client)"]
    end

    subgraph Angular2["Angular-Specific Layer (Shared)"]
        LibPres["Lib/Presentation<br/>(HTTP Client Components)"]
    end

    Shell --> Pages
    Pages --> LibPres
    Pages --> LibInfra
    Pages --> LibCore
    LibPres --> LibInfra
    Shell -.uses.-> LibInfra
    Shell -.uses.-> LibCore

    style Angular fill:#e3f2fd,stroke:#03A9F4,stroke-width:2px,color:#000000
    style Angular2 fill:#e3f2fd,stroke:#03A9F4,stroke-width:2px,color:#000000
    style Pure fill:#E0F2F1,stroke:#00897B,stroke-width:2px,color:#000000
    style Shell fill:#81D4FA,color:#000000,stroke:#03A9F4,stroke-width:1px
    style Pages fill:#81D4FA,color:#000000,stroke:#03A9F4,stroke-width:1px
    style LibPres fill:#81D4FA,color:#000000,stroke:#03A9F4,stroke-width:1px
    style LibCore fill:#FFF59D,color:#000000,stroke:#FFEB3B,stroke-width:1px
    style LibInfra fill:#B39DDB,color:#000000,stroke:#673AB7,stroke-width:1px

    linkStyle default stroke:#000000,stroke-width:1px
    linkStyle 3 stroke:#000000,stroke-width:1px,stroke-dasharray:5
    linkStyle 4 stroke:#000000,stroke-width:1px,stroke-dasharray:5
```

**Key Points:**
- 🔵 Blue = Angular-specific presentation layer
- 🟣 Purple = Framework-agnostic layers (core, domain, infrastructure)
- Arrows show dependency flow

---

## Project Statistics

- **Total TypeScript Files**: 58
- **Production Files**: 40
- **Test Files**: 18
- **Framework-Agnostic Files**: 29 (73%)
- **Angular-Specific Files**: 11 (28%)
- **Circular Dependencies**: 0 ✅

*Last generated: 2026-01-02*

---

## Project Structure

```
src/app/
├── lib/                         # Shared/reusable code across features
│   ├── core/                    # 🟣 Pure TypeScript (framework-agnostic)
│   │   ├── date-time/          # Date-time provider abstraction
│   │   └── performance/        # Performance monitoring utilities
│   ├── infrastructure/          # 🟣 Pure TypeScript (framework-agnostic)
│   │   └── http/                # HTTP client implementation
│   │       ├── body-parser/     # Response body parsers
│   │       │   ├── json/       # JSON body parser
│   │       │   └── text/       # Text body parser
│   │       ├── error/           # HTTP error types
│   │       │   ├── abort/      # Request abort errors
│   │       │   ├── network/    # Network errors
│   │       │   └── payload/    # Payload parsing errors
│   │       ├── interceptor/     # HTTP interceptors
│   │       │   ├── logger/     # Request/response logging
│   │       │   ├── response-time/ # Response time tracking
│   │       │   ├── sequence-number/ # Request sequencing
│   │       │   └── timestamp/  # Request timestamping
│   │       ├── method/          # HTTP method types
│   │       └── request-executor/ # Request execution logic
│   │           └── fetch/      # Fetch API implementation
│   └── presentation/            # 🔵 Angular-specific shared components
│       └── http-client/         # HTTP client UI components
│
└── shell/                       # 🔵 Application shell (Angular-specific)
    ├── app.component.ts
    ├── app.component.html
    ├── app.component.scss
    ├── app.config.ts
    ├── app.config.server.ts
    ├── app.routes.ts
    ├── app.routes.server.ts
    └── pages/
        └── dashboard-page/      # Route components

src/testing/
└── unit/                        # 🔵 Angular-specific test utilities
```

---

## Architecture Principles

### Layer Separation

🟣 **Framework-Agnostic Layers** (`core`, `domain`, `infrastructure`):
- Pure TypeScript interfaces and classes
- No `@angular/*` imports
- No decorators
- Constructor-based dependency injection
- Testable without Angular TestBed

🔵 **Angular-Specific Layers** (`shell`, `presentation`):
- Angular components with decorators
- Router and Material UI components
- Angular Testing Library
- `@angular/*` imports allowed

## Testing Strategy

### Unit Tests
- **Infrastructure**: Pure TypeScript tests (no Angular TestBed)
- **Components**: Vitest browser mode with Testing Library

### E2E Tests
- Framework-agnostic page objects
- Reusable across different test runners

---

## Benefits

1. **Framework Independence**: Core business logic portable to any platform
2. **Testability**: Test infrastructure code without Angular
3. **Clear Separation**: Framework-agnostic vs Angular-specific code
4. **Maintainability**: Focused responsibilities per layer
5. **Future-Proof**: Framework migration only affects presentation layer
6. **Type Safety**: Full TypeScript strict mode coverage

---

## Dependency Analysis

### Dependency Graph

**Architecture Overview** (always readable):

See the [High-Level Architecture](#high-level-architecture) diagram above for the conceptual structure.

**Detailed Module Graph**:

<details>
<summary>🔄 Module Dependencies Overview (click to expand)</summary>

<a href="module-dependencies.svg" target="_blank">
  <img src="module-dependencies.svg" alt="Module Dependencies Overview" width="800">
</a>

*Click image to open full size*

</details>

<details>
<summary>📐 Architectural Layers Visualization (click to expand)</summary>

<a href="architecture-layers.svg" target="_blank">
  <img src="architecture-layers.svg" alt="Architectural Layers Visualization" width="800">
</a>

*Click image to open full size*

**Legend**:
- 🔵 **Blue** = Presentation Layer
- 🟣 **Purple** = Infrastructure Layer
- 🟠 **Orange** = Domain Layer
- 🟡 **Yellow** = Core Layer
- 🟩 **Teal** = Lib Container (shared foundation)
- 🟥 **Rose** = Features Container (business modules)

</details>

> 💡 **Tips**:
> - Click the graph image to view full size
> - Right-click → "Open image in new tab" for maximum zoom
> - SVG files support native browser zoom (Ctrl/Cmd + scroll or pinch)
> - In VS Code: Right-click SVG → "Open Preview" for pan/zoom

Key metrics:
- ✅ No circular dependencies
- Clear separation between layers
- Minimal coupling between modules

### Analysis Commands

```bash
# Check for circular dependencies
npm run analyze:deps

# Generate visual dependency graphs
npm run analyze:modules            # Module dependencies overview
npm run analyze:layers             # Architectural layers visualization

# Find orphaned/unused files
npm run analyze:orphans
```

### Automatic Validation

A Git pre-push hook automatically:
- ✅ Checks for circular dependencies (fails push if found)
- ✅ Checks for orphaned files (fails push if found)
- ✅ Updates dependency graph and commits it
- ✅ Ensures code quality before sharing

This prevents architectural issues from being pushed to the repository.

---

## Architecture Decision Records (ADRs)

Key architectural decisions are documented in a separate file for better organization and readability.

📋 **[View Architecture Decision Records →](ADR.md)**

This includes decisions about:
- Layered architecture and framework separation
- Technology choices (Vitest, Playwright, Angular Material)
- Development practices and automation
- Future considerations for complex features

---

## Future Extensions

When adding new features:

```
src/app/
├── features/                    # Business domain features
│   └── {feature-name}/
│       ├── core/               # 🟣 Pure TypeScript core utilities
│       ├── domain/             # 🟣 Pure TypeScript business logic
│       ├── infrastructure/     # 🟣 Pure TypeScript implementations
│       └── presentation/       # 🔵 Angular components
│
├── lib/
│   ├── core/                   # 🟣 Shared core utilities (current)
│   ├── domain/                 # 🟣 Shared domain models (future)
│   ├── infrastructure/         # 🟣 Shared implementations (current)
│   └── presentation/           # 🔵 Shared Angular components (future)
```

---

**Last Updated**: January 2, 2026
