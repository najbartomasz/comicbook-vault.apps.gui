# Architecture Decision Records (ADRs)

This document records key architectural decisions made for this project, including context, rationale, and consequences.

## Table of Contents

- [ADR-001: Layered Architecture](#adr-001-layered-architecture) - ✅ Accepted
- [ADR-002: Framework-Agnostic Core](#adr-002-framework-agnostic-core) - ✅ Accepted
- [ADR-003: Vitest over Jest](#adr-003-vitest-over-jest) - ✅ Accepted
- [ADR-004: Playwright for E2E](#adr-004-playwright-for-e2e) - ✅ Accepted
- [ADR-005: Standalone Components](#adr-005-standalone-components) - ✅ Accepted
- [ADR-006: Signals for State Management](#adr-006-signals-for-state-management) - ✅ Accepted
- [ADR-007: Strict TypeScript Configuration](#adr-007-strict-typescript-configuration) - ✅ Accepted
- [ADR-008: Dependency Analysis Automation](#adr-008-dependency-analysis-automation) - ✅ Accepted
- [ADR-009: Angular Material for UI Components](#adr-009-angular-material-for-ui-components) - ✅ Accepted
- [ADR-010: State Management Strategy for Complex Features](#adr-010-state-management-strategy-for-complex-features) - 🔄 Proposed
- [ADR-011: Native Fetch API for HTTP Client](#adr-011-native-fetch-api-for-http-client) - ✅ Accepted
- [ADR-012: Error Handling Patterns](#adr-012-error-handling-patterns) - 🔄 Proposed
- [ADR-013: Logging and Monitoring Approach](#adr-013-logging-and-monitoring-approach) - 🔄 Proposed
- [ADR-014: Authentication/Authorization Strategy](#adr-014-authentication-authorization-strategy) - 🔄 Proposed
- [ADR-015: Internationalization (i18n) Approach](#adr-015-internationalization-i18n-approach) - 🔄 Proposed
- [ADR-016: Separate Providers Layer for Dependency Injection](#adr-016-separate-providers-layer-for-dependency-injection) - ✅ Accepted
- [ADR-017: Composition Root Pattern for Dependency Injection](#adr-017-composition-root-pattern-for-dependency-injection) - ✅ Accepted
- [ADR-018: DDD Layer Responsibilities and Feature-First Organization](#adr-018-ddd-layer-responsibilities-and-feature-first-organization) - ✅ Accepted
- [ADR-019: Layer Placement Decision Tree](#adr-019-layer-placement-decision-tree) - ✅ Accepted

**Legend**:
- ✅ Accepted - Decision implemented and in use
- 🔄 Proposed - Under consideration, not yet implemented
- ⛔ Rejected - Decision rejected, see rationale
- 📦 Deprecated - Previously accepted, now superseded

---

## ADR-001: Layered Architecture

**Status**: ✅ Accepted

**Context**:
The application needs to support long-term maintainability, testability, and potential framework migrations. Traditional Angular applications tightly couple business logic with framework code.

**Decision**:
Adopt a strict layered architecture separating framework-agnostic business logic from framework-specific presentation code.

**Consequences**:
- ✅ Business logic is portable across frameworks
- ✅ Infrastructure code testable without Angular TestBed
- ✅ Clear separation of concerns
- ⚠️ Requires discipline to maintain layer boundaries
- ⚠️ Initial setup more complex than monolithic approach

---

## ADR-002: Framework-Agnostic Core

**Status**: ✅ Accepted

**Context**:
Angular has undergone major changes (AngularJS → Angular 2+ → Standalone → Zoneless). Framework lock-in creates migration challenges and testing complexity.

**Decision**:
Keep the majority of codebase framework-agnostic using pure TypeScript. Only the presentation layer depends on Angular.

**Consequences**:
- ✅ Framework migration affects only a small portion of code
- ✅ Core business logic reusable in Node.js, React, Vue, etc.
- ✅ Simpler unit tests (no TestBed needed)
- ✅ Easier to reason about dependencies
- ⚠️ Requires constructor-based DI instead of Angular decorators in framework-agnostic layers

---

## ADR-003: Vitest over Jest

**Status**: ✅ Accepted

**Context**:
Need a fast, modern test runner with excellent TypeScript support. Jest requires extensive configuration for ESM and has slower startup times.

**Decision**:
Use Vitest as the primary test runner for unit and visual tests.

**Rationale**:
- ⚡ 10x faster startup than Jest
- 📦 Native ESM support (no configuration needed)
- 🔧 Vite-powered (same tooling as Angular 21+)
- 🎯 Jest-compatible API (easy migration)
- 🌐 Browser mode for component testing
- 📊 Built-in coverage with V8

**Consequences**:
- ✅ Faster test execution and development feedback
- ✅ Simplified configuration (no ESM transform needed)
- ✅ Better TypeScript path mapping support
- ✅ Unified tooling with build system
- ⚠️ Smaller ecosystem than Jest (but growing rapidly)

---

## ADR-004: Playwright for E2E

**Status**: ✅ Accepted

**Context**:
E2E tests need to be reliable, fast, and support modern browser features. Traditional solutions like Protractor are deprecated, and Cypress has limitations.

**Decision**:
Use Playwright for end-to-end testing.

**Rationale**:
- 🚀 Faster and more reliable than Selenium
- 🎭 Multi-browser support (Chromium, Firefox, WebKit)
- 🔍 Better debugging with trace viewer
- 📱 Mobile emulation support
- 🛡️ Auto-wait and retry mechanisms
- 🧪 Integrated with Vitest via @vitest/browser-playwright

**Consequences**:
- ✅ Consistent tooling (Vitest + Playwright integration)
- ✅ More reliable tests (auto-waiting reduces flakiness)
- ✅ Better cross-browser testing
- ✅ Framework-agnostic (aligns with architecture)
- ⚠️ Learning curve for team members familiar with other tools

---

## ADR-005: Standalone Components

**Status**: ✅ Accepted

**Context**:
Angular 21 supports both NgModules and standalone components. The framework is moving toward standalone as the default.

**Decision**:
Use standalone components exclusively. No NgModules in the application.

**Rationale**:
- 🎯 Aligns with Angular's future direction
- 📦 Simpler dependency management
- 🌲 Better tree-shaking
- ⚡ Faster compilation
- 🧩 More explicit imports

**Consequences**:
- ✅ Future-proof architecture
- ✅ Reduced boilerplate
- ✅ Clearer component dependencies
- ✅ Smaller bundle sizes

---

## ADR-006: Signals for State Management

**Status**: ✅ Accepted

**Context**:
Angular 21 is zoneless and embraces signals as the primary reactivity mechanism. Traditional RxJS observables add complexity for simple state.

**Decision**:
Use Angular signals for component state management. Reserve RxJS for complex async operations.

**Rationale**:
- ⚡ Better performance in zoneless mode
- 🎯 Simpler mental model for state
- 🔄 Native Angular integration
- 📊 Automatic change detection
- 🌐 Interoperability with RxJS when needed

**Consequences**:
- ✅ Cleaner component code
- ✅ Better performance
- ✅ Aligns with framework direction
- ⚠️ Team needs to learn signals pattern

---

## ADR-007: Strict TypeScript Configuration

**Status**: ✅ Accepted

**Context**:
TypeScript's strict mode catches many runtime errors at compile time but requires more careful typing.

**Decision**:
Enable strict TypeScript mode across the entire project.

**Consequences**:
- ✅ Catches bugs at compile time
- ✅ Better IDE autocomplete
- ✅ Self-documenting code through types
- ✅ Easier refactoring
- ⚠️ More initial development time
- ⚠️ Stricter null checks require defensive coding

---

## ADR-008: Dependency Analysis Automation

**Status**: ✅ Accepted

**Context**:
Manual architecture validation is error-prone. Circular dependencies and orphaned files can creep in unnoticed.

**Decision**:
Implement automated dependency analysis in Git hooks using Madge and Dependency Cruiser.

**Rationale**:
- Pre-push hooks prevent architectural violations
- Visual graphs (SVG) track architecture evolution
- Automated metrics update documentation
- Fails CI/CD if violations detected

**Consequences**:
- ✅ Architecture violations caught early
- ✅ Documentation stays current
- ✅ Visual dependency graphs auto-generated
- ✅ Zero circular dependencies maintained
- ⚠️ Slightly slower push process

---

## ADR-009: Angular Material for UI Components

**Status**: ✅ Accepted

**Context**:
Need a comprehensive, accessible UI component library that integrates seamlessly with Angular and provides a consistent design system.

**Decision**:
Use Angular Material as the primary UI component library.

**Rationale**:
- 🎨 Official Angular UI library with native integration
- ♿ WCAG accessibility standards built-in
- 🎯 Follows Material Design guidelines
- 📱 Responsive components out-of-the-box
- 🔧 Works with Angular 21 and standalone components
- 🌙 Theming system for customization
- 📦 Tree-shakable (only import what you use)
- 🧪 Well-tested and maintained by Angular team

**Consequences**:
- ✅ Consistent, professional UI without custom CSS
- ✅ Accessibility handled automatically
- ✅ Regular updates aligned with Angular releases
- ✅ Extensive documentation and community support
- ⚠️ Opinionated design (Material Design aesthetic)
- ⚠️ Bundle size consideration (though tree-shakable)
- ⚠️ Limited to Angular ecosystem (not portable to other frameworks)

**Alternatives Considered**:
- PrimeNG: More components but heavier bundle size
- NG-ZORRO: Ant Design system, good but less Angular-native
- Custom components: Full control but high maintenance cost

---

## ADR-010: State Management Strategy for Complex Features

**Status**: 🔄 Proposed

**Context**:
As the application grows, complex features may require shared state management beyond component signals.

**Decision**:
TBD - Evaluate when first complex feature requires it.

**Options to Consider**:
- NgRx SignalStore (signals-based, lightweight)
- TanStack Query (for server state)
- Custom services with signals
- RxJS subjects for event streams

---

## ADR-011: Native Fetch API for HTTP Client

**Status**: ✅ Accepted

**Context**:
Need a reliable HTTP client for API communication. Must work in both browser and SSR (server-side rendering) environments without framework coupling.

**Decision**:
Use native Fetch API wrapped in a framework-agnostic HTTP client abstraction in the infrastructure layer.

**Rationale**:
- 🌐 Native browser API (no external dependency)
- 🚀 Works in Node.js 18+ (native fetch support)
- 🔄 SSR compatible (Angular Universal/SSR)
- 📦 Zero bundle size overhead
- 🎯 Modern Promise-based API
- 🔌 Framework-agnostic (aligns with architecture)
- 🧪 Easy to mock in tests
- 💪 TypeScript support built-in

**Implementation Details**:
- Custom `FetchHttpClient` class in the infrastructure layer
- Interceptor pattern for request/response transformation
- Error handling with custom error types
- Type-safe method wrappers (GET, POST, PUT, DELETE)

**Consequences**:
- ✅ Framework-independent HTTP layer
- ✅ No additional dependencies
- ✅ SSR works out-of-the-box
- ✅ Simple to test and mock
- ⚠️ Must handle edge cases manually (timeouts, retries)
- ⚠️ No built-in interceptor like HttpClient

**Alternatives Considered**:
- **Angular HttpClient**: Tightly couples to Angular, breaks framework-agnostic goal
- **Axios**: Extra dependency (30KB), but offers better error handling and interceptors
- **ky**: Modern fetch wrapper (10KB), good TypeScript support, but adds dependency

**Why Not Axios**:
While Axios provides excellent DX with built-in interceptors and better error handling, it:
- Adds 30KB to bundle size
- Requires an external dependency
- Would couple infrastructure layer to a specific library
- Native fetch is sufficient for current needs
- Can migrate later if complexity demands it

---

## ADR-012: Error Handling Patterns

**Status**: 🔄 Proposed

**Context**:
Consistent error handling improves debugging and user experience.

**Decision**:
TBD - Define global error handling strategy.

---

## ADR-013: Logging and Monitoring Approach

**Status**: 🔄 Proposed

**Context**:
Production applications need observability for debugging and performance monitoring.

**Decision**:
TBD - Evaluate logging/monitoring solutions.

---

## ADR-014: Authentication/Authorization Strategy

**Status**: 🔄 Proposed

**Context**:
Applications handling user data require secure authentication and authorization.

**Decision**:
TBD - Define auth strategy when user features are implemented.

---

## ADR-015: Internationalization (i18n) Approach

**Status**: 🔄 Proposed

**Context**:
Multi-language support may be required for broader user base.

**Decision**:
TBD - Evaluate when i18n requirements are defined.

---

## ADR-016: Separate Providers Layer for Dependency Injection

**Status**: ✅ Accepted

**Context**:
Initially, Angular DI tokens and providers were placed in the `lib/presentation` layer alongside UI components. This created confusion because importing HTTP client tokens from "presentation" felt semantically wrong - DI configuration is not a UI concern.

**Decision**:
Create a dedicated `lib/providers` directory for Angular Dependency Injection tokens, provider configurations, and inject helper functions. Keep `lib/presentation` exclusively for UI components, directives, and pipes.

**Rationale**:
- 🎯 Clear separation: DI configuration ≠ UI components
- 📦 Semantic imports: `@lib/providers/http-client` vs `@lib/presentation/http-client`
- 🧩 Better organization: All DI tokens in one predictable location
- 🔍 Easier discovery: Developers know where to find/add tokens
- 🏗️ Scalable: Consistent pattern for adding new providers

**Implementation**:
```
lib/
├── infrastructure/          # Framework-agnostic implementations
├── providers/              # ✅ Angular DI tokens (NEW)
│   └── http-client/
│       ├── assets-http-client.token.ts
│       ├── vault-http-client.token.ts
│       └── *.inject.ts
└── presentation/           # Angular UI components only
```

**ESLint Boundary Rules**:
- `lib-providers` can import: `lib-domain`, `lib-infrastructure`, `config`
- Only presentation layers can import from `lib-providers`:
  - ✅ `lib-presentation`
  - ✅ `feature-presentation`
  - ✅ `shell`
  - ❌ Framework-agnostic layers cannot import providers

**Consequences**:
- ✅ Clearer separation of concerns
- ✅ More intuitive imports
- ✅ Enforced by ESLint boundaries
- ✅ Easier to locate DI configuration
- ✅ Presentation layer focused on UI only
- ⚠️ Additional directory to navigate
- ⚠️ Team needs to learn new convention

**Alternatives Considered**:
- Keep in `lib/presentation`: Rejected - semantically confusing
- Put in `lib/infrastructure`: Rejected - violates framework-agnostic principle
- Create `lib/di`: Rejected - "providers" more aligned with Angular terminology

---

## ADR-017: Composition Root Pattern for Dependency Injection

**Status**: ✅ Accepted

**Context**:
Dependency injection configuration was scattered across multiple locations - some in feature modules, some in shell configuration, and some inline within components. This made it difficult to:
- Understand the complete dependency graph
- Change implementations without searching the entire codebase
- Test components with different dependency configurations
- Maintain consistency in how dependencies are created

The framework-agnostic infrastructure layer contains pure TypeScript implementations, but they need to be wired into Angular's DI system somewhere. The question was: where should this composition happen?

**Decision**:
Adopt the **Composition Root Pattern** by creating a dedicated `providers/` directory as the single place where all dependency injection configuration happens. All DI tokens, provider factories, and inject helpers live in this directory.

**Rationale**:
- 🎯 **Single Responsibility**: Providers directory has one job - wire dependencies together
- 🔍 **Discoverability**: Developers know exactly where to find/add DI configuration
- 🧪 **Testability**: Easy to provide alternative implementations for testing
- 🔄 **Changeability**: Swap implementations by modifying one file instead of hunting through codebase
- 📦 **Separation of Concerns**: Infrastructure implements interfaces, providers wire them to Angular
- 🏗️ **Composition Root Principle**: Dependencies are composed at the application's root, not scattered throughout

**Implementation**:
```
src/app/
├── providers/                  # 🔵 Composition Root
│   └── http-client/
│       ├── assets-http-client.inject.ts
│       └── vault-http-client.inject.ts
│
├── lib/
│   └── http-client/
│       ├── domain/             # Interfaces (what)
│       ├── application/        # Use cases (how)
│       └── infrastructure/     # Implementations (concrete)
│
└── shell/
    └── app.config.ts           # Imports providers from composition root
```

**Pattern Example**:
```typescript
// ❌ BEFORE: DI configuration scattered
// In component:
const client = inject(HttpClient); // Which HttpClient? Where configured?

// ✅ AFTER: Composition Root Pattern
// In providers/http-client/vault-http-client.inject.ts:
export const VAULT_HTTP_CLIENT = new InjectionToken<HttpClient>('VaultHttpClient');

export function provideVaultHttpClient(): Provider {
  return {
    provide: VAULT_HTTP_CLIENT,
    useFactory: () => new FetchHttpClient(
      injectAppConfig().vaultApiUrl,
      [injectLoggerInterceptor(), injectTimestampInterceptor()]
    )
  };
}

export function injectVaultHttpClient(): HttpClient {
  return inject(VAULT_HTTP_CLIENT);
}

// In app.config.ts:
export const appConfig: ApplicationConfig = {
  providers: [
    provideVaultHttpClient(), // All composition happens here
    provideAssetsHttpClient()
  ]
};

// In component:
const client = injectVaultHttpClient(); // Clear, explicit, discoverable
```

**Benefits**:
- ✅ **Single Source of Truth**: All DI configuration in one directory
- ✅ **Explicit Dependencies**: `injectVaultHttpClient()` is self-documenting
- ✅ **Easy Refactoring**: Change implementation in one place
- ✅ **Testing**: Provide mock implementations by replacing providers
- ✅ **No Magic**: Clear where instances come from
- ✅ **Type Safety**: TypeScript ensures correct types throughout

**Consequences**:
- ✅ Clear separation: Business logic doesn't know about DI
- ✅ Framework-agnostic infrastructure: Only providers layer couples to Angular
- ✅ Consistent pattern: All features follow same DI approach
- ✅ Better documentation: Providers directory IS the dependency graph
- ⚠️ Additional files: Each injectable needs a provider file
- ⚠️ Learning curve: Team must understand composition root concept

**Alternatives Considered**:
- **DI in components**: Rejected - scatters configuration, hard to maintain
- **DI in feature modules**: Rejected - not using NgModules (ADR-005)
- **DI in infrastructure**: Rejected - violates framework-agnostic principle
- **Global providers object**: Rejected - loses type safety and discoverability

**Related ADRs**:
- ADR-002: Framework-Agnostic Core (providers bridge framework-agnostic code to Angular)
- ADR-016: Separate Providers Layer for Dependency Injection (organizational decision)
- ADR-018: DDD Layer Responsibilities (defines what belongs in each layer)

---

## ADR-018: DDD Layer Responsibilities and Feature-First Organization

**Status**: ✅ Accepted

**Context**:
The `lib/` directory was organized by technical layers (`core/`, `infrastructure/`, `providers/`) rather than features. This made it difficult to understand feature boundaries and violated DDD's bounded context principle. Team members were unclear about which layer should contain specific types of code (interfaces vs implementations, business logic vs adapters).

**Decision**:
Reorganize `lib/` using feature-first (bounded context) structure with explicit DDD layers within each feature. Define clear responsibilities for each layer: Domain, Application, Infrastructure, and Providers.

**Feature-First Structure**:
```
lib/
├── date-time/              # Bounded context: Date-time operations
│   ├── domain/
│   ├── infrastructure/
│   └── [no application layer - simple feature]
│
├── performance/            # Bounded context: Performance monitoring
│   ├── domain/
│   ├── infrastructure/
│   └── [no application layer - simple feature]
│
└── http/                   # Bounded context: HTTP communication
    ├── domain/
    ├── application/        # Has complex use cases (interceptors, parsers)
    ├── infrastructure/
    └── providers/          # Angular DI setup
```

**Layer Responsibilities**:

### 1. Domain Layer (`domain/`)
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
  includes(date: Date): boolean {
    return date >= this.start && date <= this.end;
  }
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🟢 Zero external dependencies
- 🟢 100% testable with plain Jest/Vitest
- 🟢 Portable to any platform (Node.js, browser, Deno)

---

### 2. Application Layer (`application/`)
**What belongs here:**
- ✅ **Use cases** orchestrating domain logic
- ✅ **Application services** coordinating multiple domain objects
- ✅ **DTOs** (Data Transfer Objects) for data transformation
- ✅ **Interceptors** modifying requests/responses (HTTP interceptors, logging)
- ✅ **Validators** implementing complex validation rules
- ✅ **Complex business workflows** involving multiple steps

**What does NOT belong here:**
- ❌ Simple CRUD operations (those go in infrastructure)
- ❌ Framework DI tokens (those go in providers)
- ❌ Direct database or API implementations (those go in infrastructure)
- ❌ Platform API adapters (body parsers, formatters go in infrastructure)
- ❌ UI components or presentation logic

**Example:**
```typescript
// ✅ application/interceptors/logger.http-interceptor.ts
export class LoggerHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest): Promise<HttpResponse> {
    console.log('Request:', request);
    return next(request);
  }
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

### 3. Infrastructure Layer (`infrastructure/`)
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
- ❌ Framework DI configuration (goes in providers)
- ❌ UI components (goes in presentation layer)

**Example:**
```typescript
// ✅ infrastructure/date-time-provider.ts
export class DateTimeProvider implements CurrentDateTimeProvider {
  now(): number {
    return Date.now();  // Platform API adapter
  }
}

// ✅ infrastructure/fetch-http-client.ts
export class FetchHttpClient implements HttpClient {
  async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await fetch(url);  // Platform API
    return this.parseResponse(response);
  }
}

// ✅ infrastructure/body-parsers/json.response-body-parser.ts
export class JsonResponseBodyParser implements ResponseBodyParser {
  parse<T>(response: Response): Promise<T> {
    return response.json();  // Platform API (Fetch Response)
  }
}

// ✅ infrastructure/errors/network.http-error.ts
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
  }
}
```

**Characteristics:**
- 🟢 Framework-agnostic (pure TypeScript)
- 🔴 Depends on external systems/platform APIs
- 🟡 Testable with mocks/stubs
- 🔵 Technical implementation details

---

### 4. Providers Layer (`providers/`)
**What belongs here:**
- ✅ **Angular DI tokens** (`InjectionToken`)
- ✅ **Provider functions** (`provideHttpClient()`)
- ✅ **Inject helpers** (`injectVaultHttpClient()`)
- ✅ **Factory functions** creating instances with dependencies
- ✅ **Angular-specific configuration** for dependency injection

**What does NOT belong here:**
- ❌ Business logic (goes in domain/application)
- ❌ Implementations (goes in infrastructure)
- ❌ Interfaces (goes in domain)

**Example:**
```typescript
// ✅ providers/vault-http-client.inject.ts
export const VAULT_HTTP_CLIENT = new InjectionToken<HttpClient>('VaultHttpClient');

export function provideVaultHttpClient(): Provider {
  return {
    provide: VAULT_HTTP_CLIENT,
    useFactory: () => new FetchHttpClient('https://api.vault.com')
  };
}

export function injectVaultHttpClient(): HttpClient {
  return inject(VAULT_HTTP_CLIENT);
}
```

**Characteristics:**
- 🔴 Angular-specific (couples to framework)
- 🟠 Depends on infrastructure and domain layers
- 🔵 DI configuration only

**When to create providers layer:**
- ✅ Feature needs Angular dependency injection
- ✅ Multiple configurations of same interface (VaultHttpClient, AssetsHttpClient)
- ❌ Skip for features with no Angular integration

---

**Last Updated**: January 10, 2026

**When to create providers layer:**
- ✅ Feature needs Angular dependency injection
- ✅ Multiple configurations of same interface (VaultHttpClient, AssetsHttpClient)
- ❌ Skip for features with no Angular integration

---

**Layer Import Rules**:

```
Domain       ←  (can import) ←  Domain only
    ↑
Application  ←  (can import) ←  Domain, Application
    ↑
Infrastructure ← (can import) ← Domain, Application, Infrastructure
    ↑
Providers    ←  (can import) ←  All layers (for DI setup)
```

**No Top-Level Barrel Files:**
- ❌ No `lib/http/index.ts` - would break ESLint boundaries
- ✅ Each layer has `index.ts` - enables `lib/http/domain`, `lib/http/infrastructure`
- ✅ ESLint can enforce layer dependencies at import level

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

**Migration Path**:
1. Move `lib/core/date-time` → `lib/date-time/`
2. Split into `domain/` (interfaces) and `infrastructure/` (implementations)
3. Repeat for `performance` and `http`
4. Update all imports across codebase
5. Configure ESLint boundaries for layer enforcement

**Alternatives Considered**:
- **Keep technical layers**: Rejected - violates DDD bounded contexts
- **Flat structure (no layers)**: Rejected - loses architectural clarity
- **Add top-level barrels**: Rejected - breaks ESLint boundary enforcement

---

## ADR-019: Layer Placement Decision Tree

**Status**: ✅ Accepted

**Context**:
Developers often struggle to decide which layer a new file belongs in. While ADR-018 defines layer responsibilities, it doesn't provide a practical decision-making process. This leads to:
- Files placed in wrong layers
- Inconsistent organization across features
- Time wasted debating file placement
- Architecture violations caught only in code review

**Decision**:
Provide a question-based decision tree that developers must follow when creating new files in the layered architecture.

**The Decision Tree**:

### Step 1: Does this file contain Angular-specific code?

**Question**: Does it import from `@angular/*` or use Angular decorators/APIs?

- **YES** → Go to Step 2 (Angular-specific)
- **NO** → Go to Step 3 (Framework-agnostic)

---

### Step 2: Angular-Specific Files

**2.1 - Is it a UI component, directive, or pipe?**
- **YES** → **`presentation/`** layer (or `shell/` if application-wide)
- **NO** → Go to 2.2

**2.2 - Is it dependency injection configuration?**
Questions to confirm:
- Does it define `InjectionToken`?
- Does it export `provide*()` functions?
- Does it export `inject*()` helper functions?

- **YES** → **`providers/`** layer
- **NO** → ❌ **STOP** - Angular code should only be in `presentation/` or `providers/`

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
- **NO** → ❌ **STOP** - Where does this file fit? Review ADR-018

---

### Step 4: What about "shared" utilities?

**Question**: This doesn't fit in any feature - it's used everywhere. Should it go in a `shared/` layer?

**Answer**: It depends. DDD does support shared code through the **Shared Kernel** pattern, but it must be done intentionally.

**DDD Context**:
In Domain-Driven Design:
- **Shared Kernel**: A bounded context that multiple contexts depend on (e.g., common types, validation rules)
- **Generic Subdomain**: Supporting capabilities not core to the business (date-time, logging, performance monitoring)
- **Core Domain**: Your primary business value (NOT a utilities folder)

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
| DI token | `VAULT_HTTP_CLIENT` | `providers/` |
| Provider function | `provideHttpClient()` | `providers/` |
| Inject helper | `injectVaultHttpClient()` | `providers/` |
| UI component | `HeaderComponent` | `presentation/` |
| Directive | `HighlightDirective` | `presentation/` |
| Pipe | `DateFormatPipe` | `presentation/` |

---

**Common Pitfalls & Solutions**:

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
// ❌ WRONG - infrastructure/http-client.token.ts
export const VAULT_HTTP_CLIENT = new InjectionToken<HttpClient>('VaultHttpClient');
```

**Why wrong?** Infrastructure should be framework-agnostic. `InjectionToken` is Angular-specific.

**✅ Solution:**
```typescript
// ✅ providers/vault-http-client.inject.ts
export const VAULT_HTTP_CLIENT = new InjectionToken<HttpClient>('VaultHttpClient');
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
- ✅ Complements ADR-018 with practical guidance
- ⚠️ Requires initial learning of decision tree

**How to Use**:
1. **Before creating a file**, run through the decision tree
2. **During code review**, verify file placement using the tree
3. **When unsure**, consult the Quick Reference Table
4. **If file doesn't fit**, review ADR-018 layer definitions

**Related ADRs**:
- ADR-002: Framework-Agnostic Core (explains why we separate layers)
- ADR-016: Separate Providers Layer (why providers ≠ presentation)
- ADR-017: Composition Root Pattern (where DI configuration happens)
- ADR-018: DDD Layer Responsibilities (detailed layer definitions)

---

**Last Updated**: January 10, 2026
