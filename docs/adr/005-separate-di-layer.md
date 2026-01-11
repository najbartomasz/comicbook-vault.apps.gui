# ADR-005: Separate DI Layer for Dependency Injection

**Status**: ✅ Accepted

**Context**:
In the layered architecture (see ADR-001), we separate framework-agnostic code from Angular-specific code. Initially, Angular DI tokens and provider configurations were placed in the `lib/presentation` layer alongside UI components. This created several problems:
- Importing HTTP client tokens from "presentation" felt semantically wrong - DI configuration is not a UI concern
- Mixed responsibilities made the presentation layer harder to understand
- Testing components required understanding DI setup mixed with UI code
- No clear place to look for dependency configuration

**Decision**:
Create a dedicated `lib/di` directory for Angular Dependency Injection tokens, provider configurations, and inject helper functions. Keep `lib/presentation` exclusively for UI components, directives, and pipes.

**Rationale**:
- 🎯 **Clear separation**: DI configuration ≠ UI components - each layer has single responsibility
- 📦 **Semantic imports**: `@app/di/http-client` clearly indicates dependency injection concern
- 🧩 **Better organization**: All DI tokens in one predictable location, not scattered
- 🔍 **Easier discovery**: Developers know where to find/add tokens without searching
- 🧪 **Testability**: Can provide mock configurations without touching presentation layer
- 🏗️ **Scalable**: Consistent pattern for adding new DI configuration across features
- 🔒 **Enforceable**: ESLint boundaries prevent accidental mixing of concerns

**Implementation**:

DI configuration exists at two levels:

```
src/app/
├── di/                     # ✅ Application-level DI (composition root)
│   └── http-client/
│       ├── assets-http-client.inject.ts
│       └── vault-http-client.inject.ts
│
├── lib/
│   ├── infrastructure/      # Framework-agnostic implementations
│   │
│   ├── di/                 # ✅ Feature-level DI (reusable tokens)
│   │   └── http-client/
│   │       └── http-client.inject.ts  # Shared/base tokens
│   │
│   └── presentation/       # Angular UI components only
│
└── shell/
    └── app.config.ts       # Imports from app/di/
```

**Note**: All DI files use `.inject.ts` extension containing the token, provider function, and inject helper (see ADR-006).

**ESLint Boundary Rules**:

**What `lib-di` and `app-di` can import**:
- ✅ `lib-domain` - Interface definitions
- ✅ `lib-infrastructure` - Concrete implementations to wire up
- ✅ `config` - Configuration values

**What can import from DI layers**:
- ✅ `app-di` - Application composition root
- ✅ `lib-presentation` - UI components needing dependencies
- ✅ `feature-presentation` - Feature-specific UI
- ✅ `shell` - App shell and routing

**What CANNOT import from DI layers**:
- ❌ `lib-domain` - Must remain framework-agnostic
- ❌ `lib-application` - Must remain framework-agnostic
- ❌ `lib-infrastructure` - Must remain framework-agnostic

**Why this matters**: Keeping framework-agnostic layers free from DI imports ensures they remain portable and testable without Angular.

**Consequences**:
- ✅ Clearer separation of concerns
- ✅ More intuitive imports
- ✅ Enforced by ESLint boundaries
- ✅ Easier to locate DI configuration
- ✅ Presentation layer focused on UI only
- ⚠️ Additional directory to navigate
- ⚠️ Team needs to learn new convention

**Alternatives Considered**:
- **Keep in `lib/presentation`**: Rejected - semantically confusing
- **Put in `lib/infrastructure`**: Rejected - violates framework-agnostic principle
- **Create `lib/providers`**: Rejected - "di" is more concise and clear

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Defines the DI layer
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - Detailed responsibilities for DI layer
- [ADR-006: Composition Root Pattern](./006-composition-root-pattern.md) - How DI configuration is composed

---

**Last Updated**: January 11, 2026
