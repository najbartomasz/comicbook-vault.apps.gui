# ADR-003: DDD Layer Responsibilities and Feature-First Organization

**Status**: ✅ Accepted

**Context**:
The `lib/` directory was organized by technical layers (`core/`, `infrastructure/`) rather than features. This violated Domain-Driven Design (DDD) principles:

**DDD Context**: In DDD, a **bounded context** is a logical boundary around a specific domain model. Each bounded context owns its own domain model, language, and implementation. For example, `http-client`, `date-time`, and `performance` are separate bounded contexts.

**Problems with layer-first organization**:
- Difficult to understand feature boundaries - all domain code mixed together
- Violated DDD's bounded context principle - no clear ownership
- Team members unclear about which layer should contain specific types of code
- Hard to find all code related to a single feature
- Impossible to extract a feature into a separate package

**Decision**:
Organize `lib/` using feature-first (bounded context) structure with explicit DDD layers within each feature. Define clear responsibilities for each layer: Presentation, Infrastructure, Application, and Domain.

**Feature-First Structure**:
```
lib/
├── date-time/              # Bounded context: Date-time operations
│   ├── presentation/       # Optional: Feature-specific UI
│   ├── infrastructure/
│   └── domain/
│
├── performance/            # Bounded context: Performance monitoring
│   ├── infrastructure/
│   └── domain/
│
└── file-storage/           # Bounded context: File handling
    ├── infrastructure/
    ├── application/
    └── domain/

app-providers/              # Application-level DI configuration (root level)
├── app-config/
├── auth-provider/
└── logger-provider/
```

**When to Create a New Bounded Context (Feature)**:

✅ **Create a new bounded context when**:
- It represents a distinct business capability (HTTP communication, date-time, performance)
- It has its own domain language and concepts
- It could theoretically be extracted into a separate library
- Multiple features would benefit from using it
- It has 3+ files that logically belong together

❌ **Don't create a bounded context for**:
- Single utility functions (put in most relevant existing context)
- Temporary or experiment code
- Feature-specific helpers (put in that feature's domain/application layer)

**Cross-Context Dependencies**:
- ✅ One context can import domain interfaces from another context
- ✅ Keep dependencies unidirectional (no circular dependencies)
- ⚠️ If two contexts are tightly coupled, consider merging them

---

**Layer Responsibilities**:

## 1. Presentation Layer (`presentation/`)
**What belongs here:**
- ✅ **Components** (Smart and Dumb)
- ✅ **Directives and Pipes**
- ✅ **Route configuration**
- ✅ **Facades** (if used) connecting UI to Application/Domain
- ✅ **View Models**

**What does NOT belong here:**
- ❌ Business logic (move to Domain)
- ❌ HTTP calls (move to Infrastructure)
- ❌ Complex workflows (move to Application)

**Example:**
```typescript
// ✅ presentation/user-profile.component.ts
@Component({
  selector: 'app-user-profile',
  template: `<h1>{{ user().name }}</h1>`
})
export class UserProfileComponent {
  public readonly user = input.required<User>();
}
```

**Characteristics:**
- 🔴 Framework-specific (Angular)
- 🔴 Depends on all other layers
- 🔵 View-oriented logic only

---

## 2. Infrastructure Layer (`infrastructure/`)
**What belongs here:**
- ✅ **Implementations** of domain interfaces (`FetchHttpClient`, `BrowserStorage`)
- ✅ **Adapters** to external systems (APIs, databases, file systems)
- ✅ **Platform API wrappers** (`Date.now()`, `fetch()`, `localStorage`)
- ✅ **Body parsers/formatters** wrapping platform APIs (`JsonResponseBodyParser`)
- ✅ **Error types** specific to technical concerns (`NetworkError`, `TimeoutError`)

**What does NOT belong here:**
- ❌ Business logic or validation rules (goes in domain/application)
- ❌ UI components (goes in presentation layer)

**Example:**
```typescript
// ✅ infrastructure/browser-storage.adapter.ts
export class BrowserStorageAdapter implements StoragePort {
  public save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}

// ✅ infrastructure/fetch-http-client.ts
export class FetchHttpClient implements HttpClient {
  public async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await fetch(url);
    return { data: await response.json() };
  }
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🔴 Depends on external systems/platform APIs
- 🟡 Testable with mocks/stubs
- 🔵 Technical implementation details

---

## 3. Application Layer (`application/`)
**What belongs here:**
- ✅ **Use cases** orchestrating domain logic
- ✅ **Application services** coordinating multiple domain objects
- ✅ **DTOs** (Data Transfer Objects) for data transformation
- ✅ **Interceptors** modifying requests/responses (logging, caching)
- ✅ **Validators** implementing complex validation rules

**What does NOT belong here:**
- ❌ Simple CRUD operations (those go in infrastructure)
- ❌ Direct database or API implementations (those go in infrastructure)
- ❌ Platform API adapters (body parsers, formatters go in infrastructure)
- ❌ UI components or presentation logic

**Example:**
```typescript
// ✅ application/login.use-case.ts
export class LoginUseCase {
  constructor(private authService: AuthService) {}

  public async execute(credentials: Credentials): Promise<void> {
     // Coordinator: Validate -> Call Auth Service -> Handle Result
  }
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🟠 May depend on domain layer
- 🟢 Testable without framework (mocked dependencies)
- 🔵 More complex than domain (orchestration logic)

**When to create application layer:**
- ✅ Feature has complex workflows or orchestration
- ✅ Need to coordinate multiple domain services
- ❌ Simple features with just interfaces + implementations can skip it

---

## 4. Domain Layer (`domain/`)
**What belongs here:**
- ✅ **Interfaces** defining business contracts (`HttpClient`, `StoragePort`)
- ✅ **Value objects** representing business concepts (`Email`, `DateRange`)
- ✅ **Type definitions** for domain concepts (`UserRole`, `TransactionStatus`)
- ✅ **Pure business logic** with no external dependencies
- ✅ **Domain events**

**What does NOT belong here:**
- ❌ Framework-specific code (Angular, React)
- ❌ External API calls or I/O operations
- ❌ Platform APIs (`Date`, `fetch`)
- ❌ Implementation details

**Example:**
```typescript
// ✅ domain/storage.interface.ts
export interface StoragePort {
  save(key: string, value: string): void;
}

// ✅ domain/user.interface.ts
export interface User {
  id: string;
  email: string;
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🟢 Zero external dependencies
- 🟢 100% testable with plain Jest/Vitest
- 🟢 Portable to any platform (Node.js, browser, Deno)

---

**Layer Import Rules**:

```
Presentation   ←  (can import) ←  Domain, Application, Infrastructure, Presentation
    ↑
Infrastructure ←  (can import) ←  Domain, Application, Infrastructure
    ↑
Application    ←  (can import) ←  Domain, Application
    ↑
Domain         ←  (can import) ←  Domain only
```

**Barrel Files Strategy**:

❌ **No top-level barrel file** (`lib/file-storage/index.ts`):
```typescript
// ❌ lib/file-storage/index.ts
export * from './domain';
export * from './infrastructure'; // Breaks layer boundaries!
// Now anyone can import infrastructure directly
```

✅ **Layer-specific barrel files** (`lib/file-storage/domain/index.ts`, `lib/file-storage/infrastructure/index.ts`):
```typescript
// ✅ lib/file-storage/domain/index.ts
export * from './storage.interface';

// ✅ lib/file-storage/infrastructure/index.ts
export * from './browser-storage.adapter';

// Usage - clear layer boundaries:
import { StoragePort } from '@lib/file-storage/domain';
import { BrowserStorageAdapter } from '@lib/file-storage/infrastructure';
```

This allows ESLint to enforce that only appropriate layers can import from infrastructure.

**Rationale**:
- 🎯 **Feature Discovery**: All code lives in `lib/[feature]/`, not scattered
- 🔒 **Clear Boundaries**: Layer-specific imports enforce architectural rules
- 🧪 **Testability**: Pure domain/application layers, swappable infrastructure
- 📦 **Scalability**: Easy to add new bounded contexts (`lib/comics/`, `lib/users/`)
- 🧹 **Maintainability**: Clear layer responsibilities reduce confusion

**Consequences**:
- ✅ Features are self-contained with clear boundaries
- ✅ New developers know exactly where to put code
- ✅ ESLint enforces layer separation automatically
- ✅ Easy to extract features into separate packages
- ✅ Domain layer completely portable to other frameworks
- ⚠️ Requires team training on DDD layers
- ⚠️ More directories to navigate initially
- ⚠️ Must maintain discipline to prevent layer violations

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Overall architecture vision
- [ADR-002: Layer Placement Decision Tree](./002-layer-placement-decision-tree.md) - Practical guide for deciding which layer
- [ADR-006: Composition Root Pattern for Dependency Injection](./006-composition-root-pattern.md) - Updated for app-providers pattern

---

Last Updated: January 18, 2026
