# Application Architecture

![Architecture Validated](https://img.shields.io/badge/architecture-validated-green)
![Documentation Validated](https://img.shields.io/badge/docs-validated-green)
![Dependencies](https://img.shields.io/badge/circular%20deps-0-green)
![Layer Separation](https://img.shields.io/badge/layer%20separation-strict-blue)
![Framework Agnostic](https://img.shields.io/badge/framework%20agnostic-75%25-purple)
![Angular Specific](https://img.shields.io/badge/angular%20specific-25%25-blue)
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
    subgraph Presentation["🔵 Presentation Layer"]
        Shell["Shell<br/>(Routes, Bootstrapping)"]
        FeatComponents["Feature Pages<br/>(Components)"]
    end

    subgraph Providers["⚪ Application Providers"]
        CompRoot["Composition Root<br/>(DI Configuration)"]
    end

    subgraph API["🟣 API Integration"]
        ExtAPI1["External API A"]
        ExtAPI2["External API B"]
    end

    subgraph Config["🟠 Configuration Layer"]
        GlobalConfig["App Configuration<br/>(Runtime Settings)"]
    end

    subgraph Features["🟥 Features (Vertical Slices)"]
        subgraph FeatureA["Feature A"]
            F1Domain["🟠 Domain"]
            F1App["🟢 Application"]
            F1Infra["🟣 Infrastructure"]
            F1Pres["🔵 Presentation"]
        end
        subgraph FeatureB["Feature B"]
            F2Domain["🟠 Domain"]
            F2App["🟢 Application"]
            F2Infra["🟣 Infrastructure"]
            F2Pres["🔵 Presentation"]
        end
    end

    subgraph Lib["🟩 Lib (Horizontal Slices)"]
        subgraph ContextA["Shared Context A"]
            C1Domain["🟠 Domain"]
            C1App["🟢 Application"]
            C1Infra["🟣 Infrastructure"]
        end
        subgraph ContextB["Shared Context B"]
            C2Domain["🟠 Domain"]
            C2Infra["🟣 Infrastructure"]
        end
    end

    %% Presentation Layer
    Shell --> FeatComponents
    Shell --> CompRoot
    FeatComponents --> F1Pres
    FeatComponents --> F2Pres

    %% Application Providers
    CompRoot --> F1Infra
    CompRoot --> F2Infra
    CompRoot --> C1Infra
    CompRoot --> C2Infra
    CompRoot --> GlobalConfig
    CompRoot --> ExtAPI1
    CompRoot --> ExtAPI2

    %% Feature Internal Flow
    F1Pres --> F1App
    F1App --> F1Domain
    F1Infra --> F1Domain

    F2Pres --> F2App
    F2App --> F2Domain
    F2Infra --> F2Domain

    %% Cross-Context Dependencies
    F1Infra --> C1Domain
    F2Infra --> C2Domain

    %% Lib Dependencies
    C1App --> C1Domain
    C1Infra --> C1Domain
    C2Infra --> C2Domain

    %% Container Styles
    style Presentation fill:#e3f2fd,stroke:#03A9F4,stroke-width:2px,color:#000000
    style Providers fill:#f5f5f5,stroke:#9E9E9E,stroke-width:2px,color:#000000
    style Config fill:#fff3e0,stroke:#FF9800,stroke-width:2px,color:#000000
    style Features fill:#FCE4EC,stroke:#C2185B,stroke-width:2px,color:#000000
    style Lib fill:#E0F2F1,stroke:#00897B,stroke-width:2px,color:#000000

    style FeatureA fill:#f9f9f9,stroke:#C2185B,stroke-width:1px,color:#000000
    style FeatureB fill:#f9f9f9,stroke:#C2185B,stroke-width:1px,color:#000000
    style ContextA fill:#f9f9f9,stroke:#00897B,stroke-width:1px,color:#000000
    style ContextB fill:#f9f9f9,stroke:#00897B,stroke-width:1px,color:#000000

    %% Node Styles
    style Shell fill:#81D4FA,color:#000000,stroke:#03A9F4,stroke-width:1px
    style FeatComponents fill:#81D4FA,color:#000000,stroke:#03A9F4,stroke-width:1px
    style CompRoot fill:#E0E0E0,color:#000000,stroke:#9E9E9E,stroke-width:1px
    style GlobalConfig fill:#FFB74D,color:#000000,stroke:#FF9800,stroke-width:1px

    style F1Domain fill:#FFCC80,color:#000000,stroke:#FF9800,stroke-width:1px
    style F1App fill:#81C784,color:#000000,stroke:#388E3C,stroke-width:1px
    style F1Infra fill:#B39DDB,color:#000000,stroke:#673AB7,stroke-width:1px
    style F1Pres fill:#81D4FA,color:#000000,stroke:#03A9F4,stroke-width:1px

    style F2Domain fill:#FFCC80,color:#000000,stroke:#FF9800,stroke-width:1px
    style F2App fill:#81C784,color:#000000,stroke:#388E3C,stroke-width:1px
    style F2Infra fill:#B39DDB,color:#000000,stroke:#673AB7,stroke-width:1px
    style F2Pres fill:#81D4FA,color:#000000,stroke:#03A9F4,stroke-width:1px

    style C1Domain fill:#FFCC80,color:#000000,stroke:#FF9800,stroke-width:1px
    style C1App fill:#81C784,color:#000000,stroke:#388E3C,stroke-width:1px
    style C1Infra fill:#B39DDB,color:#000000,stroke:#673AB7,stroke-width:1px
    style C2Domain fill:#FFCC80,color:#000000,stroke:#FF9800,stroke-width:1px
    style C2Infra fill:#B39DDB,color:#000000,stroke:#673AB7,stroke-width:1px

    linkStyle default stroke:#000000,stroke-width:1px
```

**Architectural Pattern:**
- 🔵 **Presentation** = Angular components & UI (framework-coupled)
- ⚪ **Providers** = Angular dependency injection configuration for features and libs (framework-coupled, composition root)
- 🟠 **Domain** = Business logic & contracts (framework-agnostic)
- 🟢 **Application** = Use cases & orchestration (framework-agnostic)
- 🟣 **Infrastructure** = Technical implementations (framework-agnostic)
- 🟥 **Features** = Business domain modules (vertical slices)
- 🟩 **Lib** = Shared bounded contexts (horizontal slices)
- 🟠 **Config** = Application configuration (framework-agnostic)

**Dependency Rules:**
- ✅ **Features → Features**: Allowed (via domain interfaces)
- ✅ **Features → Libs**: Allowed (reuse shared contexts)
- ✅ **Libs → Libs**: Allowed (compose contexts)
- ❌ **Libs → Features**: Forbidden (libs must remain reusable)
- ✅ **Presentation** depends on Application, Domain, and Providers
- ✅ **Application** depends on Domain only
- ✅ **Infrastructure** implements Domain interfaces
- ✅ **Providers** bridges framework-agnostic code to Angular DI system
- ✅ All framework-agnostic layers testable without Angular

---

## Project Statistics

- **Total TypeScript Files**: 95
- **Production Files**: 60
- **Test Files**: 35
- **Framework-Agnostic Files**: 45 (75%)
- **Angular-Specific Files**: 15 (25%)
- **Circular Dependencies**: 0 ✅

*Last generated: 2026-01-18*

---

## Project Structure

```
src/app/
├── api/                         # 🟣 External APIs integration
│   ├── assets/                 # Assets API integration
│   │   └── infrastructure/     # API implementation
│   │       ├── assets-api-client.factory.ts
│   │       ├── assets-api-client.ts
│   │       └── index.ts
│   └── vault/                  # Vault API integration
│       └── infrastructure/     # API implementation
│           ├── index.ts
│           ├── vault-api-client.factory.ts
│           └── vault-api-client.ts
│
├── config/                      # 🟠 Configuration Layer
│   └── app/                    # App configuration context
│       ├── domain/             # Interfaces & contracts
│       │   ├── app-config.ts
│       │   └── index.ts
│       └── infrastructure/     # Infrastructure implementations
│           ├── app-config.dto.ts
│           ├── app-config.provider.ts
│           └── index.ts
│
├── lib/                         # Shared/reusable code (DDD bounded contexts)
│   ├── date-time/              # 🟢 Date-time bounded context
│   │   ├── domain/             # Interfaces & contracts
│   │   │   ├── current-date-time-provider.interface.ts
│   │   │   └── index.ts
│   │   └── infrastructure/     # Platform API adapters
│   │       ├── date-time-provider.ts
│   │       └── index.ts
│   │
│   ├── http-client/            # 🔵 HTTP communication context
│   │   ├── application/        # Use cases & orchestration
│   │   │   ├── interceptors/
│   │   │   │   ├── logger/
│   │   │   │   │   ├── request-logger.http-interceptor.ts
│   │   │   │   │   └── response-logger.http-interceptor.ts
│   │   │   │   ├── response-time/
│   │   │   │   │   ├── response-time.constants.ts
│   │   │   │   │   └── response-time.http-interceptor.ts
│   │   │   │   ├── sequence-number/
│   │   │   │   │   └── sequence-number.http-interceptor.ts
│   │   │   │   ├── timestamp/
│   │   │   │   │   └── timestamp.http-interceptor.ts
│   │   │   │   ├── http-interceptor-next.type.ts
│   │   │   │   └── http-interceptor.interface.ts
│   │   │   └── index.ts
│   │   ├── domain/             # Business contracts & value objects
│   │   │   ├── method/
│   │   │   │   └── http-method.ts
│   │   │   ├── status/
│   │   │   │   └── http-status.ts
│   │   │   ├── http-client.interface.ts
│   │   │   ├── http-request.interface.ts
│   │   │   ├── http-response.interface.ts
│   │   │   ├── http-url.ts
│   │   │   └── index.ts
│   │   └── infrastructure/     # Technical implementations
│   │       ├── body-parsers/
│   │       │   ├── json/
│   │       │   │   └── json.response-body-parser.ts
│   │       │   ├── text/
│   │       │   │   └── text-plain.response-body-parser.ts
│   │       │   └── response-body-parser.interface.ts
│   │       ├── errors/
│   │       │   ├── abort/
│   │       │   │   └── http-abort-error.ts
│   │       │   ├── network/
│   │       │   │   └── http-network-error.ts
│   │       │   └── payload/
│   │       │       └── http-payload-error.ts
│   │       ├── request-executor/
│   │       │   ├── fetch/
│   │       │   │   └── fetch.http-request-executor.ts
│   │       │   └── http-request-executor.interface.ts
│   │       ├── fetch-http-client.ts
│   │       └── index.ts
│   │
│   └── performance/            # 🟢 Performance monitoring context
│       ├── domain/             # Interfaces & contracts
│       │   ├── high-resolution-timestamp-provider.interface.ts
│       │   └── index.ts
│       └── infrastructure/     # Platform API adapters
│           ├── index.ts
│           └── performance-timestamp-provider.ts
│
└── shell/                       # 🔵 Application shell (Angular-specific)
    ├── pages/
    │   └── dashboard-page/      # Route components
    │       ├── dashboard-page.component.html
    │       ├── dashboard-page.component.scss
    │       └── dashboard-page.component.ts
    ├── app.component.html
    ├── app.component.scss
    ├── app.component.ts
    └── index.ts

src/app-providers/               # ⚪ Application-level providers (composition root)
├── app-config/                  # Application configuration providers
│   └── app-config.provider.ts
├── assets-api-client/           # Assets API client providers
│   └── assets-api-client.provider.ts
├── vault-api-client/            # Vault API client providers
│   └── vault-api-client.provider.ts
└── index.ts                     # Exported provider functions

src/testing/
└── unit/                        # 🔵 Angular-specific test utilities
    ├── http/
    │   ├── fetch/
    │   │   └── response-builder.ts
    │   └── index.ts
    ├── index.ts
    └── setup-component.ts
```

---

## Architecture Principles

### Layer Separation

🟠 **Domain Layer** (`domain/`):
- Pure TypeScript interfaces and value objects
- Business contracts and domain models
- No external dependencies
- Framework-agnostic
- Defines what the system does

🟢 **Application Layer** (`application/`):
- Pure TypeScript use cases and orchestration
- Coordinates domain objects
- No framework dependencies
- Implements business workflows (e.g., interceptors)
- Testable without Angular TestBed

🟣 **Infrastructure Layer** (`infrastructure/`):
- Pure TypeScript implementations
- Platform API adapters (fetch, Date, performance)
- No `@angular/*` imports
- Constructor-based dependency injection
- Testable without Angular TestBed

🟠 **Configuration Layer** (`app/config/`):
- Application configuration management
- Type-safe configuration interfaces
- Framework-agnostic business logic

⚪ **Application Providers Layer** (`app-providers/`):
- Application-level dependency injection configuration (composition root)
- Bridge between framework-agnostic code and Angular DI
- Provider functions that wire features and libs to Angular DI system
- Organized by context (features, libs, and app-level configuration)
- Simple `provide*()` functions that return Angular `Provider` objects
- Uses `@angular/*` imports

🔵 **Presentation Layer** (`shell/`, `presentation/`):
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
- 🔵 **Cyan Tint** = Providers Layer
- 🟢 **Green** = Application Layer
- 🟣 **Purple** = Infrastructure Layer
- 🟠 **Orange** = Domain Layer
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

Key architectural decisions are documented in individual files for better organization and readability.

📋 **[View Architecture Decision Records →](adr/README.md)**

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
│       ├── domain/             # 🟠 Pure TypeScript business logic
│       ├── application/        # 🟢 Pure TypeScript use cases & orchestration
│       ├── infrastructure/     # 🟣 Pure TypeScript implementations
│       └── presentation/       # 🔵 Angular components
│
└── lib/
    ├── {context-name}/         # Shared bounded context
    │   ├── domain/             # 🟠 Shared domain models
    │   ├── application/        # 🟢 Shared use cases (e.g., interceptors)
    │   └── infrastructure/     # 🟣 Shared implementations
    └── presentation/           # 🔵 Shared Angular components (future)

src/app-providers/              # ⚪ Application-level providers
├── {feature-name}/             # Provider configuration for features
│   └── {feature-name}.provider.ts  # Provider function
└── {context-name}/             # Provider configuration for lib contexts
    └── {context-name}.provider.ts  # Provider function
```

---

**Last Updated**: January 18, 2026
