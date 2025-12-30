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

**Last Updated**: December 31, 2025
