# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for this project. An ADR is a document that captures an important architectural decision made along with its context and consequences.

## What is an ADR?

An Architecture Decision Record is a short text file that describes:
- **Context**: The issue motivating this decision
- **Decision**: The change that we're proposing or have agreed to
- **Status**: Proposed, Accepted, Rejected, Deprecated, or Superseded
- **Consequences**: The impact (both positive and negative) of the decision

## Status Legend

- ✅ **Accepted** - Decision implemented and in use
- 🔄 **Proposed** - Under consideration, not yet implemented
- ⛔ **Rejected** - Decision rejected (see rationale in ADR)
- 📦 **Deprecated** - Previously accepted, now superseded

## All ADRs

| # | Title | Status | Summary |
|---|-------|--------|---------|
| [001](./001-layered-architecture.md) | Layered Architecture | ✅ Accepted | Strict separation of framework-agnostic business logic from framework-specific presentation code |
| [002](./002-layer-placement-decision-tree.md) | Layer Placement Decision Tree | ✅ Accepted | Question-based guide for determining which layer a file belongs in |
| [003](./003-ddd-layer-responsibilities.md) | DDD Layer Responsibilities | ✅ Accepted | Feature-first organization with explicit Domain, Application, Infrastructure, and DI layers |
| [004](./004-framework-agnostic-core.md) | Framework-Agnostic Core | ✅ Accepted | Keep majority of codebase framework-agnostic using pure TypeScript |
| [005](./005-separate-di-layer.md) | Separate DI Layer | ✅ Accepted | Dedicated DI directory for Angular dependency injection configuration |
| [006](./006-composition-root-pattern.md) | Composition Root Pattern | ✅ Accepted | Single place for all dependency injection configuration |
| [007](./007-dependency-analysis-automation.md) | Dependency Analysis Automation | ✅ Accepted | Automated dependency analysis enforcing layer boundaries with Dependency Cruiser |
| [008](./008-strict-typescript-configuration.md) | Strict TypeScript Configuration | ✅ Accepted | Enable strict TypeScript mode for compile-time safety and better developer experience |
| [009](./009-vitest-over-jest.md) | Vitest over Jest | ✅ Accepted | Use Vitest as primary test runner for faster execution and better ESM support |
| [010](./010-playwright-for-e2e.md) | Playwright for E2E Testing | ✅ Accepted | Use Playwright for reliable, cross-browser end-to-end testing |
| [011](./011-standalone-components.md) | Standalone Components | ✅ Accepted | Use standalone components exclusively, no NgModules |
| [012](./012-signals-for-state-management.md) | Signals for State Management | ✅ Accepted | Use Angular signals for component state, reserve RxJS for complex async operations |
| [013](./013-angular-material-for-ui-components.md) | Angular Material for UI Components | ✅ Accepted | Use Angular Material as primary UI component library |
| [014](./014-native-fetch-api-for-http-client.md) | Native Fetch API for HTTP Client | ✅ Accepted | Use native Fetch API wrapped in framework-agnostic adapter |
| [015](./015-state-management-strategy.md) | State Management Strategy | 🔄 Proposed | Evaluate state management solutions for complex features |
| [016](./016-error-handling-patterns.md) | Error Handling Patterns | 🔄 Proposed | Define global error handling strategy |
| [017](./017-logging-and-monitoring.md) | Logging and Monitoring | 🔄 Proposed | Evaluate logging/monitoring solutions |
| [018](./018-authentication-authorization.md) | Authentication/Authorization | 🔄 Proposed | Define auth strategy when user features are implemented |
| [019](./019-internationalization.md) | Internationalization (i18n) | 🔄 Proposed | Evaluate when i18n requirements are defined |

## Quick Links

- [ARCHITECTURE.md](../ARCHITECTURE.md) - High-level architecture overview
- [Development Guidelines](./../README.md) - Project setup and development workflow

## When to Create a New ADR

Create a new ADR when you need to make a decision about:
- Architecture patterns or styles
- Technology selection (frameworks, libraries, tools)
- Development practices and conventions
- Quality requirements (performance, security, accessibility)
- Significant technical debt or refactoring approaches

## ADR Template

When creating a new ADR, use this template:

```markdown
# ADR-XXX: [Title]

**Status**: 🔄 Proposed | ✅ Accepted | ⛔ Rejected | 📦 Deprecated

**Context**:
[What is the issue that we're seeing that is motivating this decision or change?]

**Decision**:
[What is the change that we're proposing and/or doing?]

**Rationale** (optional):
[Why this decision? What alternatives were considered?]

**Consequences**:
- ✅ [Positive consequence]
- ⚠️ [Negative consequence or trade-off]

**Alternatives Considered** (optional):
- [Alternative 1]: Rejected because...
- [Alternative 2]: Rejected because...

**Related ADRs** (optional):
- ADR-XXX: [Related decision]
```

---

**Last Updated**: January 11, 2026
