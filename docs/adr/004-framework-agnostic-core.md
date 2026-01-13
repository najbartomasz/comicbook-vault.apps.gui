# ADR-004: Framework-Agnostic Core

**Status**: ✅ Accepted

**Context**:
Angular has undergone major changes (AngularJS → Angular 2+ → Standalone → Zoneless signals). Each transition required significant rewrites. Framework lock-in creates several problems:
- **Migration risk**: Tight coupling to framework makes upgrades expensive and risky
- **Testing complexity**: Angular TestBed adds overhead and complexity to simple unit tests
- **Limited reusability**: Business logic locked in Angular can't be reused in Node.js, React, or other platforms
- **Vendor dependence**: Framework decisions dictate architecture, not business needs
- **Cognitive load**: Mixing framework APIs with business logic makes code harder to understand

**Decision**:
Keep the majority of codebase framework-agnostic using pure TypeScript. Only the Shell/Presentation and DI layers depend on Angular.

**Rationale**:
- 🎯 **Business logic portability**: Core domain can run anywhere (browser, Node.js, Deno, Bun)
- 🧪 **Simple testing**: Test business logic with plain Jest/Vitest, no framework setup needed
- 🔄 **Framework flexibility**: Can migrate presentation layer without rewriting business logic
- 📦 **Code reusability**: Share domain/application layers across web, mobile, server applications
- 🧠 **Clearer architecture**: Separation forces thinking about business logic vs framework concerns
- ⚡ **Faster execution**: No framework overhead in business logic layer

**Implementation**:
- **Domain layer**: Pure TypeScript interfaces, types, and business logic
- **Application layer**: Pure TypeScript use cases and orchestration
- **Infrastructure layer**: Pure TypeScript adapters (no Angular decorators)
- **DI layer**: Angular-specific DI configuration
- **Presentation layer**: Angular components, directives, pipes

**Examples**:

```typescript
// ❌ WRONG: Framework-coupled business logic
// domain/user-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable() // Angular-specific!
export class UserService {
  constructor(private http: HttpClient) {} // Angular dependency!

  getUser(id: string) {
    return this.http.get(`/users/${id}`); // Framework API!
  }
}

// ✅ CORRECT: Framework-agnostic business logic
// domain/user.repository.ts
export interface UserRepository { // Pure interface
  getUser(id: string): Promise<User>;
}

// infrastructure/http-user.repository.ts
export class HttpUserRepository implements UserRepository { // Pure class
  constructor(private httpClient: HttpClient) {} // Domain interface, not framework!

  async getUser(id: string): Promise<User> {
    const response = await this.httpClient.get<User>(`/users/${id}`);
    return response.data;
  }
}

// di/user-repository/injection-tokens/user-repository.injection-token.ts (Angular-specific)
export const USER_REPOSITORY = new InjectionToken<UserRepository>('UserRepository');

// di/user-repository/providers/user-repository.provider.ts
export function provideUserRepository(): Provider {
  return { provide: USER_REPOSITORY, useClass: HttpUserRepository };
}

// di/user-repository/inject-functions/user-repository.inject-function.ts
export function injectUserRepository(): UserRepository {
  return inject(USER_REPOSITORY);
}
```

**What "Pure TypeScript" Means**:
- ✅ Standard TypeScript classes, interfaces, and functions
- ✅ No `import` statements from framework packages (`@angular/*`, `react`, etc.)
- ✅ No framework decorators (`@Injectable`, `@Component`, etc.)
- ✅ Constructor-based dependency injection (parameters, not decorators)
- ✅ Can run in Node.js, Deno, or browser without framework
- ❌ No framework-specific types or utilities

**Consequences**:
- ✅ Framework migration affects only ~20% of codebase (Presentation + DI layers)
- ✅ Core business logic (Domain + Application) reusable across platforms
- ✅ Simple, fast unit tests without TestBed or framework mocking
- ✅ Easier to reason about dependencies and data flow
- ✅ Can test business logic in isolation from framework
- ✅ Clear separation between "what" (domain) and "how" (infrastructure)
- ⚠️ Requires discipline to avoid importing Angular in domain/application layers
- ⚠️ Constructor-based DI instead of Angular decorators in framework-agnostic code
- ⚠️ Team needs to understand architectural boundaries

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Defines framework-agnostic layers
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - What belongs in each layer
- [ADR-005: Separate DI Layer](./005-separate-di-layer.md) - Isolates Angular dependencies
- [ADR-006: Composition Root Pattern](./006-composition-root-pattern.md) - Wiring framework-agnostic code to Angular

---

**Last Updated**: January 11, 2026
