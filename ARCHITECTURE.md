# Application Architecture

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
        LibInfra["Lib/Infrastructure<br/>(HTTP Client)"]
    end

    Shell --> Pages
    Pages --> LibInfra
    Shell -.uses.-> LibInfra

    style Angular fill:#e3f2fd,stroke:#03A9F4,stroke-width:3px,color:#000000
    style Pure fill:#ede7f6,stroke:#673AB7,stroke-width:3px,color:#000000
    style Shell fill:#bbdefb,color:#000000,stroke:#03A9F4,stroke-width:2px
    style Pages fill:#bbdefb,color:#000000,stroke:#03A9F4,stroke-width:2px
    style LibInfra fill:#d1c4e9,color:#000000,stroke:#673AB7,stroke-width:2px

    linkStyle default stroke:#000000,stroke-width:1px
    linkStyle 2 stroke:#000000,stroke-width:1px,stroke-dasharray:5
```

**Key Points:**
- 🔵 Blue = Angular-specific (shell, pages)
- 🟣 Purple = Framework-agnostic (lib/infrastructure)
- Arrows show dependency flow

---

## Project Structure

```
src/app/
├── lib/                         # Shared/reusable code across features
│   └── infrastructure/          # 🟣 Pure TypeScript (framework-agnostic)
│       └── http/                # HTTP client implementation
│
└── shell/                       # 🔵 Application shell (Angular-specific)
    ├── app.component.ts
    ├── app.config.ts
    ├── app.routes.ts
    └── pages/
        └── dashboard-page/      # Route components

src/testing/
├── unit/                        # 🔵 Angular-specific test utilities
└── e2e/                         # 🟣 Framework-agnostic E2E utilities
```

---

## Architecture Principles

### Layer Separation

🟣 **Framework-Agnostic Layers** (`lib/infrastructure`):
- Pure TypeScript interfaces and classes
- No `@angular/*` imports
- No decorators
- Constructor-based dependency injection
- Testable without Angular TestBed

🔵 **Angular-Specific Layers** (`shell`, `testing/unit`):
- Angular components with decorators
- Router and Material UI components
- Angular Testing Library
- `@angular/*` imports allowed

### Dependency Flow

```
Shell (Angular)
    ↓
Lib Infrastructure (Pure TypeScript)
```

**Rules:**
- `shell` depends on `lib/infrastructure`
- `lib/infrastructure` has no Angular dependencies
- Testing utilities mirror the architecture (`unit` = Angular, `e2e` = Pure TS)

---

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
5. **Future-Proof**: Framework migration only affects shell layer (~30% of code)
6. **Type Safety**: Full TypeScript strict mode coverage

---

## Dependency Analysis

### Dependency Graph

**Architecture Overview** (always readable):

See the [High-Level Architecture](#high-level-architecture) diagram above for the conceptual structure.

**Detailed Module Graph**:

<details>
<summary>🔄 Module Dependencies Overview (click to expand)</summary>

<a href="deps-graph.svg" target="_blank">
  <img src="deps-graph.svg" alt="Module Dependencies Overview" width="800">
</a>

*Click image to open full size*

</details>

<details>
<summary>📐 Architectural Layers Visualization (click to expand)</summary>

<a href="deps-report.svg" target="_blank">
  <img src="deps-report.svg" alt="Architectural Layers Visualization" width="800">
</a>

*Click image to open full size*

**Legend**:
- 🔵 **Blue** = Presentation Layer (shell)
- 🟣 **Purple** = Infrastructure Layer (lib/infrastructure)
- 🟠 **Orange** = Domain Layer (reserved for future use)
- ⚪ **Grey** = Core Layer (reserved for future use)

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

## Future Extensions

When adding new features:

```
src/app/
├── features/                    # Business domain features
│   └── {feature-name}/
│       ├── domain/             # 🟣 Pure TypeScript business logic
│       ├── infrastructure/     # 🟣 Pure TypeScript implementations
│       └── presentation/       # 🔵 Angular components
│
├── lib/
│   ├── domain/                 # 🟣 Shared domain models (future)
│   ├── infrastructure/         # 🟣 Shared implementations (current)
│   └── presentation/           # 🔵 Shared Angular components (future)
```

---

**Last Updated**: December 15, 2025
