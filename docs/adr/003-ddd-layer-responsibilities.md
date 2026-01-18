# ADR-003: DDD Layer Responsibilities and Feature-First Organization

**Status**: ✅ Accepted

**Context**:
The `lib/` directory was organized by technical layers (`core/`, `infrastructure/`, `di/`) rather than features. This violated Domain-Driven Design (DDD) principles:

**DDD Context**: In DDD, a **bounded context** is a logical boundary around a specific domain model. Each bounded context owns its own domain model, language, and implementation. For example, `http-client`, `date-time`, and `performance` are separate bounded contexts.

**Problems with layer-first organization**:
- Difficult to understand feature boundaries - all domain code mixed together
- Violated DDD's bounded context principle - no clear ownership
- Team members unclear about which layer should contain specific types of code
- Hard to find all code related to a single feature
- Impossible to extract a feature into a separate package

**Decision**:
Organize `lib/` using feature-first (bounded context) structure with explicit DDD layers within each feature. Define clear responsibilities for each layer: Domain, Application, Infrastructure, and DI.

**Feature-First Structure**:
```
lib/
├── date-time/              # Bounded context: Date-time operations
│   ├── domain/
│   └── infrastructure/
│
├── performance/            # Bounded context: Performance monitoring
│   ├── domain/
│   └── infrastructure/
│
└── http-client/            # Bounded context: HTTP communication
    ├── domain/
    ├── application/
    └── infrastructure/

app-providers/              # Application-level DI configuration (root level)
├── app-config/
├── assets-api-client/
└── vault-api-client/
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

## 1. Domain Layer (`domain/`)
**What belongs here:**
- ✅ **Interfaces** defining business contracts (`HttpClient`, `CurrentDateTimeProvider`)
- ✅ **Value objects** representing business concepts (`HttpUrl`, `HttpMethod`)
- ✅ **Type definitions** for domain concepts (`HttpStatus`, `HttpHeader`)
- ✅ **Pure business logic** with no external dependencies (date calculations, validation rules)
- ✅ **Domain events** if needed

**What does NOT belong here:**
- ❌ Framework-specific code (Angular, React)
- ❌ External API calls or I/O operations
- ❌ Platform APIs (`Date`, `performance`, `fetch`)
- ❌ Implementation details

**Example:**
```typescript
// ✅ domain/http-client.interface.ts
export interface HttpClient {
  get<T>(url: string): Promise<HttpResponse<T>>;
}

// ✅ domain/http-method.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// ✅ domain/date-range.ts (pure business logic)
export class DateRange {
  includes(date: Date): boolean { /* pure logic */ }
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🟢 Zero external dependencies
- 🟢 100% testable with plain Jest/Vitest
- 🟢 Portable to any platform (Node.js, browser, Deno)

---

## 2. Application Layer (`application/`)
**What belongs here:**
- ✅ **Use cases** orchestrating domain logic
- ✅ **Application services** coordinating multiple domain objects
- ✅ **DTOs** (Data Transfer Objects) for data transformation
- ✅ **Interceptors** modifying requests/responses (HTTP interceptors, logging)
- ✅ **Validators** implementing complex validation rules
- ✅ **Complex business workflows** involving multiple steps

**What does NOT belong here:**
- ❌ Simple CRUD operations (those go in infrastructure)
- ❌ Framework DI tokens (those go in DI layer)
- ❌ Direct database or API implementations (those go in infrastructure)
- ❌ Platform API adapters (body parsers, formatters go in infrastructure)
- ❌ UI components or presentation logic

**Example:**
```typescript
// ✅ application/interceptors/logger.http-interceptor.ts
export class LoggerHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest): Promise<HttpResponse> { /* ... */ }
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🟠 May depend on domain layer
- 🟢 Testable without framework (mocked dependencies)
- 🔵 More complex than domain (orchestration logic)

**When to create application layer:**
- ✅ Feature has interceptors or complex workflows
- ✅ Need to coordinate multiple domain services
- ✅ Transforming data between layers
- ❌ Simple features with just interfaces + implementations can skip it

---

## 3. Infrastructure Layer (`infrastructure/`)
**What belongs here:**
- ✅ **Implementations** of domain interfaces (`FetchHttpClient`, `DateTimeProvider`)
- ✅ **Adapters** to external systems (APIs, databases, file systems)
- ✅ **Platform API wrappers** (`Date.now()`, `performance.now()`, `fetch()`, `response.json()`)
- ✅ **Body parsers/formatters** wrapping platform APIs (`JsonResponseBodyParser`, `XmlFormatter`)
- ✅ **Error types** specific to technical concerns (`NetworkError`, `TimeoutError`)
- ✅ **Low-level utilities** (request executors, connection pooling)
- ✅ **Third-party library integrations** (axios wrapper, ORM models)

**What does NOT belong here:**
- ❌ Business logic or validation rules (goes in domain/application)
- ❌ Framework DI configuration (goes in DI layer)
- ❌ UI components (goes in presentation layer)

**Example:**
```typescript
// ✅ infrastructure/date-time-provider.ts
export class DateTimeProvider implements CurrentDateTimeProvider {
  now(): number { return Date.now(); }
}

// ✅ infrastructure/fetch-http-client.ts
export class FetchHttpClient implements HttpClient {
  async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await fetch(url);
    return { data: await response.json() };
  }
}

// ✅ infrastructure/body-parsers/json.response-body-parser.ts
export class JsonResponseBodyParser implements ResponseBodyParser {
  parse<T>(response: Response): Promise<T> {
    return response.json(); // wraps platform API
  }
}

// ✅ infrastructure/errors/network.http-error.ts
export class NetworkError extends Error {
  constructor(message: string) { super(message); }
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🔴 Depends on external systems/platform APIs
- 🟡 Testable with mocks/stubs
- 🔵 Technical implementation details

---

**Note on DI Configuration**: Previously, a separate DI layer existed within features. As of January 2026, this has been replaced with a simpler `app-providers/` directory at root level for application-level dependency injection configuration. See [ADR-005](./005-separate-di-layer.md) and [ADR-006](./006-composition-root-pattern.md) for details.

---

**Layer Import Rules**:

```
Domain       ←  (can import) ←  Domain only
    ↑
Application  ←  (can import) ←  Domain, Application
    ↑
Infrastructure ← (can import) ← Domain, Application, Infrastructure
    ↑
Providers    ← (can import) ← All layers (for DI setup, root-level app-providers/)
```

**Barrel Files Strategy**:

❌ **No top-level barrel file** (`lib/http/index.ts`):
```typescript
// ❌ BAD - lib/http/index.ts
export * from './domain';
export * from './infrastructure'; // Breaks layer boundaries!
// Now anyone can import infrastructure directly: import { FetchHttpClient } from '@lib/http'
```

✅ **Layer-specific barrel files** (`lib/http/domain/index.ts`, `lib/http/infrastructure/index.ts`):
```typescript
// ✅ GOOD - lib/http/domain/index.ts
export * from './http-client.interface';
export * from './http-method';

// ✅ GOOD - lib/http/infrastructure/index.ts
export * from './fetch-http-client';

// Usage - clear layer boundaries:
import { HttpClient } from '@lib/http/domain';           // ✅ Domain interface
import { FetchHttpClient } from '@lib/http/infrastructure'; // ✅ Infrastructure implementation
```

This allows ESLint to enforce that only appropriate layers can import from infrastructure.

**Rationale**:
- 🎯 **Feature Discovery**: All HTTP code lives in `lib/http/`, not scattered
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
- [ADR-005: Separate DI Layer for Dependency Injection](./005-separate-di-layer.md) - Deprecated, replaced by app-providers
- [ADR-006: Composition Root Pattern for Dependency Injection](./006-composition-root-pattern.md) - Updated for app-providers pattern

---

Last Updated: January 18, 2026
