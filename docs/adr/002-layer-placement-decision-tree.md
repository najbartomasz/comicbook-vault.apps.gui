# ADR-002: Layer Placement Decision Tree

**Status**: ✅ Accepted

**Context**:
Developers often struggle to decide which layer a new file belongs in. While ADR-001 defines layer responsibilities, it doesn't provide a practical decision-making process. This leads to:
- Files placed in wrong layers
- Inconsistent organization across features
- Time wasted debating file placement
- Architecture violations caught only in code review

**Decision**:
Provide a question-based decision tree that developers must follow when creating new files in the layered architecture.

**Quick Visual Guide**:

```
Start here
    │
    ▼
Angular code? (@angular/* imports?)
    │
    ├─ YES ──► UI code? ──► YES ──► presentation/
    │           │
    │           └─ NO ──► DI config? ──► YES ──► di/
    │                      │
    │                      └─ NO ──► ❌ ERROR
    │
    └─ NO (Pure TypeScript)
        │
        ▼
    Business contract/interface?
        │
        ├─ YES ──────────────────────► domain/
        │
        └─ NO ──► Orchestrates logic? ──► YES ──► application/
                   │
                   └─ NO ──► Platform API call? ──► YES ──► infrastructure/
                              │
                              └─ NO ──► ❌ Review ADR-001
```

**The Decision Tree**:

### Step 1: Does this file contain Angular-specific code?

**Question**: Does it import from `@angular/*` or use Angular-specific APIs?

**Examples of Angular-specific code:**
- Imports from `@angular/core`, `@angular/common`, etc.
- Uses Angular decorators: `@Component`, `@Directive`, `@Pipe`, `@Injectable`
- Uses Angular APIs: `InjectionToken`, `inject()`, `computed()`, `signal()`
- Uses Angular lifecycle hooks: `OnInit`, `OnDestroy`
- Uses Angular DI: `provideHttpClient()`, dependency injection in constructors

**Examples of framework-agnostic code:**
- Pure TypeScript interfaces: `interface HttpClient { ... }`
- Type definitions: `type HttpMethod = 'GET' | 'POST'`
- Classes with no Angular imports: `class UserValidator { ... }`
- Functions with no Angular dependencies: `function formatDate(date: Date): string`

- **YES** → Go to Step 2 (Angular-specific)
- **NO** → Go to Step 3 (Framework-agnostic)

---

### Step 2: Angular-Specific Files

**2.1 - Is it a UI component, directive, or pipe?**
- **YES** → **`presentation/`** layer
  - Use `shell/` for application-wide UI elements
  - Use feature-specific presentation folders for feature components
- **NO** → Go to 2.2

**2.2 - Is it dependency injection configuration?**
Questions to confirm:
- Does it define `InjectionToken`?
- Does it export `provide*()` functions?
- Does it export `inject*()` helper functions?

- **YES** → **`di/`** layer
- **NO** → ❌ **STOP** - Angular code should only be in `presentation/` or `di/`

---

### Step 3: Framework-Agnostic Files

**3.1 - Does it define business contracts or concepts?**

Ask yourself:
- Is it an **interface** defining what something does? (not how)
- Is it a **type definition** for a business concept?
- Is it a **value object** with pure business logic?
- Does it contain **business rules** with zero external dependencies?
- Can it run in Node.js, Deno, browser, and React without changes?

- **YES** → **`domain/`** layer
- **NO** → Go to 3.2

**3.2 - Does it orchestrate or transform business logic?**

**What is orchestration logic?**
Orchestration means **coordinating multiple steps or components** to accomplish a task, without implementing the low-level details. Think of it like a conductor leading an orchestra - the conductor doesn't play the instruments, but coordinates when each section plays.

**Orchestration characteristics:**
- ✅ Calls multiple domain interfaces or objects
- ✅ Defines the **sequence** of operations
- ✅ Handles **workflow** and **decision-making**
- ✅ Transforms data **between** layers (DTOs)
- ✅ Adds cross-cutting concerns (logging, validation, caching)
- ❌ Does NOT make platform API calls directly
- ❌ Does NOT implement low-level details

**Examples of orchestration:**
```typescript
// ✅ Orchestration - coordinates domain objects
class AuthenticateUserUseCase {
  execute(username: string, password: string) {
    // Step 1: Validate (uses domain validator)
    this.validator.validate(username, password);

    // Step 2: Authenticate (uses domain authenticator)
    const result = this.authenticator.authenticate(username, password);

    // Step 3: Log result (uses domain logger)
    this.logger.log('User authenticated', result);

    return result;
  }
}

// ✅ Orchestration - interceptor adding behavior
class CachingHttpInterceptor {
  intercept(request: HttpRequest) {
    // Check cache first
    if (this.cache.has(request.url)) {
      return this.cache.get(request.url);
    }

    // Call next interceptor, then cache result
    return this.next.handle(request).then(response => {
      this.cache.set(request.url, response);
      return response;
    });
  }
}
```

**Examples of NOT orchestration (infrastructure):**
```typescript
// ❌ NOT orchestration - directly calls platform API
class FetchHttpClient {
  get(url: string) {
    return fetch(url); // Direct platform API call = infrastructure
  }
}
```

Ask yourself:
- Is it a **use case** coordinating multiple domain objects?
- Is it an **interceptor** modifying requests/responses?
- Is it a **DTO** transforming data between layers?
- Is it **complex validation** involving multiple domain concepts?
- Does it import from `domain/` but not call platform APIs?

- **YES** → **`application/`** layer
- **NO** → Go to 3.3

**3.3 - Does it call external systems or platform APIs?**

Ask yourself:
- Does it **implement** a domain interface?
- Does it call platform APIs (`Date.now()`, `fetch()`, `performance.now()`)?
- Does it **adapt** third-party libraries?
- Does it **wrap** response/request bodies using platform methods (`.json()`, `.text()`)?
- Is it an **error type** for technical failures (`NetworkError`, `TimeoutError`)?
- Does it handle **I/O operations** (HTTP, file system, storage)?

- **YES** → **`infrastructure/`** layer
- **NO** → ❌ **STOP** - Where does this file fit? Review ADR-001

---

### Step 4: What about "shared" utilities?

**Question**: This doesn't fit in any feature - it's used everywhere. Should it go in a `shared/` layer?

**Answer**: ⚠️ **NO** - Don't create a monolithic `shared/` folder. Instead, create focused bounded contexts in `lib/`.

**Key Principle**: If code is "shared," it means it has a specific purpose. Name it after that purpose, not "shared" or "common" or "utils".

**DDD Context**:
In Domain-Driven Design, there are different types of supporting code:
- **Shared Kernel**: A bounded context that multiple contexts depend on (e.g., common types, validation rules)
- **Generic Subdomain**: Supporting capabilities not core to the business (date-time, logging, performance monitoring)
- **Core Domain**: Your primary business value (NOT a utilities folder)

All of these should be **separate bounded contexts**, not dumped in a `shared/` folder.

**Our Approach**:
We prefer **multiple small bounded contexts** over a single monolithic `shared/` dumping ground:

- **Is it a generic subdomain?** (date-time, performance, logging, validation)
  - **YES** → Create a **bounded context** in `lib/[feature-name]/` with proper DDD layers
  - Example: `lib/date-time/`, `lib/performance/`, `lib/logging/`
  - Each is a self-contained feature with domain/infrastructure/application layers

- **Is it truly a shared kernel?** (used by 3+ bounded contexts, fundamental business concept)
  - **YES** → Create `lib/shared-kernel/` with proper DDD layers
  - Example: `lib/shared-kernel/domain/result.ts` (Result<T> type used everywhere)
  - ⚠️ **Be careful**: This should be rare and well-justified

- **Is it a single utility function?** (one function, no complex logic)
  - **YES** → Put it in the domain layer of the most relevant bounded context
  - If no clear owner, consider if it's actually needed or inline it

- **Is it cross-cutting infrastructure?** (HTTP client, error handling)
  - **YES** → It's a bounded context! Create `lib/http/`, `lib/errors/`, etc.

**Why we avoid a monolithic `shared/` layer**:
- ❌ Becomes a dumping ground for "I don't know where this goes"
- ❌ Everything depends on it (creates tight coupling)
- ❌ Violates Single Responsibility Principle
- ✅ Small, focused bounded contexts are more maintainable
- ✅ Clear ownership and responsibilities
- ✅ Easier to understand dependencies

**When to create `lib/shared-kernel/`**:
- ✅ Used by 3+ bounded contexts
- ✅ Fundamental business concept (not technical infrastructure)
- ✅ Changes rarely and has broad impact
- ✅ Well-defined domain with clear responsibilities
- ❌ NOT for "I don't know where to put this"

**Current bounded contexts in our project**:
- `lib/date-time/` - Generic subdomain for date/time operations
- `lib/performance/` - Generic subdomain for performance monitoring
- `lib/http/` - Generic subdomain for HTTP communication

---

**Quick Reference Table**:

| File Type | Example | Layer |
|-----------|---------|-------|
| Interface | `HttpClient`, `DateTimeProvider` | `domain/` |
| Type definition | `HttpMethod`, `HttpStatus` | `domain/` |
| Value object | `DateRange`, `EmailAddress` | `domain/` |
| Pure business logic | `calculateDiscount()`, `validateAge()` | `domain/` |
| Use case | `AuthenticateUserUseCase` | `application/` |
| Interceptor | `LoggerHttpInterceptor` | `application/` |
| DTO | `UserLoginDto`, `ApiResponseDto` | `application/` |
| Implementation | `FetchHttpClient`, `DateTimeProvider` | `infrastructure/` |
| Platform wrapper | `JsonResponseBodyParser` (wraps `.json()`) | `infrastructure/` |
| Adapter | `AxiosAdapter`, `LocalStorageAdapter` | `infrastructure/` |
| Technical error | `NetworkError`, `DatabaseError` | `infrastructure/` |
| DI token | `VAULT_HTTP_CLIENT` | `di/` |
| Provider function | `provideHttpClient()` | `di/` |
| Inject helper | `injectVaultHttpClient()` | `di/` |
| UI component | `HeaderComponent` | `presentation/` |
| Directive | `HighlightDirective` | `presentation/` |
| Pipe | `DateFormatPipe` | `presentation/` |

---

**Common Pitfalls & Solutions**:

**Why this section matters**: These are the most frequent layer placement mistakes found in code reviews. Each pitfall violates core architecture principles and causes real problems:
- Makes code harder to test (platform dependencies in wrong layers)
- Creates framework coupling where it shouldn't exist
- Violates separation of concerns
- Breaks the dependency rule (inner layers depending on outer layers)

Learn from these examples to avoid architectural violations.

---

### ❌ Pitfall 1: Platform API wrappers in domain

```typescript
// ❌ WRONG - domain/date-time-provider.ts
export class DateTimeProvider {
  now(): number {
    return Date.now(); // Platform API!
  }
}
```

**Why wrong?** Domain should have zero dependencies on platform APIs.

**✅ Solution:**
```typescript
// ✅ domain/current-date-time.provider.ts (interface only)
export interface CurrentDateTimeProvider {
  now(): number;
}

// ✅ infrastructure/date-time.provider.ts (implementation)
export class DateTimeProvider implements CurrentDateTimeProvider {
  now(): number {
    return Date.now(); // Platform API allowed here
  }
}
```

---

### ❌ Pitfall 2: Response body parsers in application layer

```typescript
// ❌ WRONG - application/parsers/json.response-body-parser.ts
export class JsonResponseBodyParser {
  parse(response: Response): Promise<unknown> {
    return response.json(); // Platform API!
  }
}
```

**Why wrong?** It's wrapping a platform API (`.json()`), not orchestrating business logic.

**✅ Solution:**
```typescript
// ✅ domain/response-body-parser.ts (interface)
export interface ResponseBodyParser {
  parse<T>(response: Response): Promise<T>;
}

// ✅ infrastructure/body-parsers/json.response-body-parser.ts
export class JsonResponseBodyParser implements ResponseBodyParser {
  parse<T>(response: Response): Promise<T> {
    return response.json(); // Platform API allowed in infrastructure
  }
}
```

---

### ❌ Pitfall 3: DI tokens in infrastructure

```typescript
// ❌ WRONG - infrastructure/http-client.injection-token.ts
export const VAULT_HTTP_CLIENT = new InjectionToken<HttpClient>('VaultHttpClient');
```

**Why wrong?** Infrastructure should be framework-agnostic. `InjectionToken` is Angular-specific.

**✅ Solution:**
```typescript
// ✅ di/http-client/injection-tokens/vault-http-client.injection-token.ts
export const VAULT_HTTP_CLIENT = new InjectionToken<HttpClient>('VaultHttpClient');

// ✅ di/http-client/inject-functions/vault-http-client.inject-function.ts
export function injectVaultHttpClient(): HttpClient {
  return inject(VAULT_HTTP_CLIENT);
}
```

---

### ❌ Pitfall 4: Interceptors in infrastructure

```typescript
// ❌ WRONG - infrastructure/interceptors/logger.http-interceptor.ts
export class LoggerHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest): Promise<HttpResponse> {
    console.log('Request:', request);
    return next(request);
  }
}
```

**Why wrong?** Interceptors orchestrate behavior (logging, transformation), not implement I/O.

**✅ Solution:**
```typescript
// ✅ application/interceptors/logger.http-interceptor.ts
export class LoggerHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest): Promise<HttpResponse> {
    console.log('Request:', request);
    return next(request);
  }
}
```

---

**Rationale**:
- 🎯 **Clarity**: Step-by-step questions eliminate guesswork
- 📚 **Onboarding**: New developers can self-serve without asking
- ⚡ **Speed**: Faster file placement decisions
- 🔒 **Consistency**: Everyone follows same decision process
- 🧪 **Validation**: Easy to verify in code reviews

**Consequences**:
- ✅ Reduced architecture violations
- ✅ Faster development (no debate over placement)
- ✅ Consistent codebase organization
- ✅ Self-service for new team members
- ✅ Complements ADR-003 with practical guidance
- ⚠️ Requires initial learning of decision tree

**How to Use**:
1. **Before creating a file**, run through the decision tree
2. **During code review**, verify file placement using the tree
3. **When unsure**, consult the Quick Reference Table
4. **If file doesn't fit**, review ADR-001 layer definitions

**Test File Placement**:

Test files should be **co-located** with the code they test:

```
app/
  domain/
    user.ts
    user.spec.ts          ← Unit test next to source
  application/
    authenticate.use-case.ts
    authenticate.use-case.spec.ts
  infrastructure/
    fetch-http-client.ts
    fetch-http-client.spec.ts
  presentation/
    login.component.ts
    login.component.spec.ts
```

**Test types and placement:**
- **Unit tests** (`.spec.ts`): Same directory as source file
- **Integration tests** (`.integration.spec.ts`): Same directory as source file
- **E2E tests** (`.e2e.ts`): Separate `e2e/` folder at project root
- **Visual tests** (`.visual.spec.ts`): Same directory as component

**Rationale:**
- ✅ Easy to find tests (always next to source)
- ✅ Tests move with code during refactoring
- ✅ Clear ownership (test is part of the feature)
- ✅ No separate `__tests__` or `test/` directories to maintain

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md)
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md)
- [ADR-004: Framework-Agnostic Core](./004-framework-agnostic-core.md)
- [ADR-005: Separate DI Layer](./005-separate-di-layer.md)
- [ADR-006: Composition Root Pattern](./006-composition-root-pattern.md)

---

**Last Updated**: January 11, 2026
