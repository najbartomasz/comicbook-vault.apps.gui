# ADR-006: Composition Root Pattern for Dependency Injection

**Status**: ✅ Accepted

**Context**:
With framework-agnostic infrastructure implementations established, we needed to determine how dependency injection configuration should be organized. Initially, DI configuration was scattered across multiple locations - some in feature modules, some in shell configuration, and some inline within components. This made it difficult to:
- Understand the complete dependency graph
- Change implementations without searching the entire codebase
- Test components with different dependency configurations
- Maintain consistency in how dependencies are created

The framework-agnostic infrastructure layer contains pure TypeScript implementations, but they need to be wired into Angular's DI system somewhere. The question was: where should this composition happen?

**Decision**:
Adopt the **Composition Root Pattern** by creating `app-providers/` directory at root level as the single place where all application-level dependency injection configuration happens. All provider factories live in this directory.

**Evolution Note**:
Originally (ADR-005 - now deprecated), we used a three-tier DI structure nested in `app/di`. This proved over-engineered. The current approach uses simple provider functions with Angular's built-in class-based tokens.

**Rationale**:
- 🎯 **Single Responsibility**: Providers directory has one job - wire dependencies together
- 🔍 **Discoverability**: Developers know exactly where to find/add DI configuration
- 🧪 **Testability**: Easy to provide alternative implementations for testing
- 🔄 **Changeability**: Swap implementations by modifying one file instead of hunting through codebase
- 📦 **Separation of Concerns**: Infrastructure implements interfaces, providers wire them to Angular
- 🏗️ **Composition Root Principle**: Dependencies are composed at the application's root, not scattered throughout
- ✅ **Simplicity**: Single provider file per context - no token/provider/inject-function split

**Implementation**:

The `app-providers/` directory at root level contains provider functions for application-level dependencies:

```
src/app-providers/              # Composition Root (root-level, not in app/)
├── index.ts                    # Barrel exports
├── app-config/
│   └── app-config.provider.ts
├── auth-provider/
│   └── auth.provider.ts
└── logger-provider/
    └── logger.provider.ts

src/app/
├── lib/                        # Framework-agnostic implementations
│   └── auth/
│       ├── domain/             # Interfaces (what)
│       ├── application/        # Use cases (how)
│       └── infrastructure/     # Implementations (concrete)
│
└── shell/
    └── app.config.client.ts    # Imports providers from root-level app-providers/
```

**File Naming Convention**:
- `*.provider.ts` - Contains `provide*()` function that returns Angular `Provider`
- Name should match the context (e.g., `auth.provider.ts`)
- Use kebab-case for file names, camelCase for function names

**Pattern Example**:
```typescript
// ✅ app-providers/auth-provider/auth.provider.ts
import { type Provider } from '@angular/core';
import { AuthService } from '@lib/auth/domain';
import { HttpAuthService } from '@lib/auth/infrastructure';
import { AppConfig } from '@app-providers/app-config';

export const provideAuthService = (): Provider => ({
    provide: AuthService,  // Class-based token (no custom InjectionToken needed)
    useFactory: (appConfig: AppConfig) =>
        new HttpAuthService(appConfig.apiUrl),
    deps: [AppConfig]
});

// ✅ app-providers/index.ts
export { provideAppConfig } from './app-config/app-config.provider';
export { provideAuthService } from './auth-provider/auth.provider';

// ✅ app.config.client.ts
import { provideAuthService, provideAppConfig } from './app-providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppConfig(),
    provideAuthService(),  // All composition happens here
    // ...other providers
  ]
};

// ✅ In component - use Angular's inject() with class token
import { inject } from '@angular/core';
import { AuthService } from '@lib/auth/domain';

const client = inject(AuthService); // Type-safe, no custom token needed
```

**Usage Guidelines**:

1. **Simple provider pattern**:
   - One `provide*()` function per context
   - Returns Angular `Provider` object
   - Uses class-based tokens (no custom `InjectionToken` needed)
   - Factory pattern with explicit dependencies via `deps` array

2. **When to create provider configuration**:
   - ✅ Application-level dependencies that need configuration
   - ✅ Multiple instances of same type (AuthService, LoggerService)
   - ✅ Dependencies requiring other dependencies (factory pattern)
   - ✅ Need to swap implementations (production vs testing)
   - ❌ Simple classes with no dependencies - use `providedIn: 'root'` directly

3. **Injection in components**:
   - Use Angular's `inject()` directly with class token
   - No custom inject functions needed
   - Type-safe and discoverable via IDE

**Benefits**:
- ✅ **Single Source of Truth**: All providers in one root-level directory
- ✅ **Simple Pattern**: One file per context, no three-tier structure
- ✅ **Standard Angular**: Uses built-in class-based tokens and `useFactory`
- ✅ **Less Boilerplate**: No custom `InjectionToken` or inject-function files
- ✅ **Type Safety**: TypeScript ensures correct types throughout
- ✅ **Easy Refactoring**: Change implementation in one place
- ✅ **Testing**: Provide mock implementations via `TestBed.overrideProvider`

**Consequences**:
- ✅ Clear separation: Business logic doesn't know about DI
- ✅ Framework-agnostic infrastructure: Only providers couple to Angular
- ✅ Consistent pattern: All application providers follow same approach
- ✅ Better documentation: Provider directory IS the dependency graph
- ✅ Simpler structure: One file per context vs three-tier structure
- ✅ Root-level organization: Providers at `app-providers/`, not nested in `app/di`
- ⚠️ Testing requires `TestBed.overrideProvider` (standard Angular approach)

**Alternatives Considered**:
- **Three-tier DI structure** (ADR-005): Deprecated - too much ceremony for simple providers
- **DI in components**: Rejected - scatters configuration, hard to maintain
- **DI in feature modules**: Rejected - not using NgModules (ADR-011)
- **DI in infrastructure**: Rejected - violates framework-agnostic principle
- **Global providers object**: Rejected - loses type safety and discoverability

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Defines architectural layers
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - Defines what belongs in each layer
- [ADR-004: Framework-Agnostic Core](./004-framework-agnostic-core.md) - Providers bridge framework-agnostic code to Angular

---

**Last Updated**: January 18, 2026
