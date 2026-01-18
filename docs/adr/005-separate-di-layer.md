# ADR-005: Separate DI Layer for Dependency Injection

**Status**: 📦 Deprecated

**Superseded by**: The `app-providers/` pattern at root level - simpler composition root without nested directory structure

**Historical Context**:
In the layered architecture (see ADR-001), we separate framework-agnostic code from Angular-specific code. Initially, Angular DI tokens and provider configurations were placed in the `lib/presentation` layer alongside UI components. This created several problems:
- Importing HTTP client tokens from "presentation" felt semantically wrong - DI configuration is not a UI concern
- Mixed responsibilities made the presentation layer harder to understand
- Testing components required understanding DI setup mixed with UI code
- No clear place to look for dependency configuration

**Original Decision** (Now Deprecated):
Create a dedicated `lib/di` and `app/di` directories for Angular Dependency Injection tokens, provider configurations, and inject helper functions with a three-tier structure (injection-tokens, providers, inject-functions).

**Why Deprecated**:
The three-tier DI layer structure (`injection-tokens/`, `providers/`, `inject-functions/`) proved to be **over-engineered** for this project's needs:
- ⚠️ Too much ceremony: Creating three files (token, provider, inject-function) for simple providers
- ⚠️ Unnecessary indirection: Most providers don't need custom injection tokens
- ⚠️ Harder to navigate: Files spread across three subdirectories
- ⚠️ Framework overhead: Fighting Angular's natural DI patterns instead of embracing them

**New Approach** (as of January 2026):
Use Angular's built-in class-based DI with simple `provide*()` functions at root level:

```
src/app-providers/              # Root-level composition root
├── index.ts                    # Barrel exports
├── app-config/
│   └── app-config.provider.ts
├── auth-provider/
│   └── auth.provider.ts
└── logger-provider/
    └── logger.provider.ts
```

**Example of New Pattern**:
```typescript
// ✅ app-providers/auth-provider/auth.provider.ts
import { type Provider } from '@angular/core';
import { AuthService } from '@lib/auth/domain';
import { HttpAuthService } from '@lib/auth/infrastructure';
import { AppConfig } from '@app-providers/app-config';

export const provideAuthService = (): Provider => ({
    provide: AuthService,
    useFactory: (config: AppConfig) => new HttpAuthService(config.apiUrl),
    deps: [AppConfig]
});

// ✅ app.config.ts
import { provideAuthService } from './app-providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuthService(),
    // ...other providers
  ]
};
```

**Benefits of New Approach**:
- ✅ **Simpler**: One provider function file instead of three (token, provider, inject-function)
- ✅ **Standard Angular**: Uses class-based tokens and `useFactory`
- ✅ **Type-safe**: TypeScript ensures correct types without custom tokens
- ✅ **Less boilerplate**: Reduced file count and complexity
- ✅ **Clearer organization**: All providers at root level, not nested in `app/di`
- ✅ **Easier testing**: Can still provide mock implementations via `TestBed.overrideProvider`

**Migration Notes**:
- Old `di/` directories removed
- Injection tokens removed in favor of class-based tokens
- Inject functions no longer needed - use Angular's `inject()` directly with class token
- Provider functions now live in `app-providers/` at root level

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Defines architectural layers
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - Layer responsibilities
- [ADR-006: Composition Root Pattern](./006-composition-root-pattern.md) - Updated for app-providers pattern

---

**Last Updated**: January 18, 2026
