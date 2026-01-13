# ADR-006: Composition Root Pattern for Dependency Injection

**Status**: ✅ Accepted

**Context**:
With the DI layer established (see ADR-005), we needed to determine how dependency injection configuration should be organized. Initially, DI configuration was scattered across multiple locations - some in feature modules, some in shell configuration, and some inline within components. This made it difficult to:
- Understand the complete dependency graph
- Change implementations without searching the entire codebase
- Test components with different dependency configurations
- Maintain consistency in how dependencies are created

The framework-agnostic infrastructure layer contains pure TypeScript implementations, but they need to be wired into Angular's DI system somewhere. The question was: where should this composition happen?

**Decision**:
Adopt the **Composition Root Pattern** by creating a dedicated `di/` directory as the single place where all dependency injection configuration happens. All DI tokens, provider factories, and inject helpers live in this directory.

**Rationale**:
- 🎯 **Single Responsibility**: DI directory has one job - wire dependencies together
- 🔍 **Discoverability**: Developers know exactly where to find/add DI configuration
- 🧪 **Testability**: Easy to provide alternative implementations for testing
- 🔄 **Changeability**: Swap implementations by modifying one file instead of hunting through codebase
- 📦 **Separation of Concerns**: Infrastructure implements interfaces, DI layer wires them to Angular
- 🏗️ **Composition Root Principle**: Dependencies are composed at the application's root, not scattered throughout

**Implementation**:

The `di/` directory mirrors the structure of `lib/` features, creating a clear mapping between domain features and their DI configuration:

```
src/app/
├── di/                       # 🔵 Composition Root
│   ├── http-client/          # DI config for lib/http-client
│   │   ├── inject-functions/
│   │   │   ├── assets-http-client.inject-function.ts
│   │   │   └── vault-http-client.inject-function.ts
│   └── date-time/            # DI config for lib/date-time
│       └── inject-functions/
│           └── current-date-time.inject-function.ts
│
├── lib/
│   ├── http-client/
│   │   ├── domain/           # Interfaces (what)
│   │   ├── application/      # Use cases (how)
│   │   └── infrastructure/   # Implementations (concrete)
│   └── date-time/
│       ├── domain/
│       └── infrastructure/
│
└── shell/
    └── app.config.ts       # Imports DI config from composition root
```

**File Naming Convention**:
- `*.inject-function.ts` - Contains inject helper functions using Angular `inject()`
- Name should match the domain interface (e.g., `HttpClient` → `vault-http-client.inject-function.ts`)
- Use kebab-case for file names, PascalCase for function names

**Pattern Example**:
```typescript
// ❌ BEFORE: DI configuration scattered
// In component:
const client = inject(HttpClient); // Which HttpClient? Where configured?

// ✅ AFTER: Composition Root Pattern
// In di/http-client/inject-functions/vault-http-client.inject-function.ts:
export function injectVaultHttpClient(): HttpClient {
  return inject(VAULT_HTTP_CLIENT);
}

// In di/http-client/injection-tokens/vault-http-client.injection-token.ts:
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

**Usage Guidelines**:

1. **Three-part pattern for each injectable**:
   - `InjectionToken`: Unique identifier for the dependency
   - `provide*()` function: Factory that creates/configures the instance
   - `inject*()` helper: Type-safe accessor for components/services

2. **When to create DI configuration**:
   - ✅ Multiple implementations of same interface (VaultHttpClient, AssetsHttpClient)
   - ✅ Complex construction requiring dependencies/configuration
   - ✅ Need to swap implementations (production vs testing)
   - ❌ Simple classes with no dependencies - use `@Injectable()` directly

3. **Token naming convention**:
   - Prefix with context: `VAULT_HTTP_CLIENT`, `ASSETS_HTTP_CLIENT`
   - All caps with underscores for constants
   - Descriptive enough to be self-documenting

**Benefits**:
- ✅ **Single Source of Truth**: All DI configuration in one directory
- ✅ **Explicit Dependencies**: `injectVaultHttpClient()` is self-documenting
- ✅ **Easy Refactoring**: Change implementation in one place
- ✅ **Testing**: Provide mock implementations by replacing providers
- ✅ **No Magic**: Clear where instances come from
- ✅ **Type Safety**: TypeScript ensures correct types throughout

**Consequences**:
- ✅ Clear separation: Business logic doesn't know about DI
- ✅ Framework-agnostic infrastructure: Only DI layer couples to Angular
- ✅ Consistent pattern: All features follow same DI approach
- ✅ Better documentation: DI directory IS the dependency graph
- ⚠️ Additional files: Each injectable needs a DI configuration file
- ⚠️ Learning curve: Team must understand composition root concept

**Alternatives Considered**:
- **DI in components**: Rejected - scatters configuration, hard to maintain
- **DI in feature modules**: Rejected - not using NgModules (ADR-009)
- **DI in infrastructure**: Rejected - violates framework-agnostic principle
- **Global providers object**: Rejected - loses type safety and discoverability

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Defines the DI layer
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - Defines what belongs in each layer
- [ADR-004: Framework-Agnostic Core](./004-framework-agnostic-core.md) - DI layer bridges framework-agnostic code to Angular
- [ADR-005: Separate DI Layer](./005-separate-di-layer.md) - Organizational decision for DI layer

---

**Last Updated**: January 11, 2026
