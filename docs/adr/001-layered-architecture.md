# ADR-001: Layered Architecture

**Status**: ✅ Accepted

**Context**:
The application needs to support long-term maintainability, testability, and potential framework migrations. Traditional Angular applications tightly couple business logic with framework code, creating concrete problems:

**Real-world pain points we want to avoid:**

1. **Testing nightmare**: Business logic trapped inside Angular components requires TestBed, making tests slow and brittle
   - Example: Cannot test date validation without mocking Angular DI, ChangeDetectorRef, etc.

2. **Framework lock-in**: Business logic using Angular-specific APIs cannot be reused
   - Example: HTTP logic using `HttpClient` cannot run in Node.js server or Electron app

3. **Unclear organization**: No clear rules about where code belongs
   - Example: Team debates whether `UserValidator` goes in services/, components/, or utils/

4. **Risky refactoring**: Changes ripple unpredictably due to tight coupling
   - Example: Changing date format breaks 20+ components because formatting logic is duplicated

5. **Framework upgrades**: Major Angular version changes require rewriting business logic
   - Example: Angular 18 migration forces rewriting validation logic from RxJS to signals

6. **Performance issues**: Cannot optimize or tree-shake unused code effectively
   - Example: Importing one utility drags in the entire Angular framework

**Decision**:
Adopt a strict layered architecture based on Hexagonal Architecture (Ports & Adapters) principles, separating framework-agnostic business logic from framework-specific presentation code.

**Architecture Layers**:

```
┌─────────────────────────────────────────┐
│              Presentation               │  ← Angular-specific
│  - Components, Routes, App Config       │     (depends on all layers)
├─────────────────────────────────────────┤
│                   DI                    │  ← DI Wiring
│  - Angular DI Tokens & Setup            │     (depends on Domain + Infrastructure)
├─────────────────────────────────────────┤
│             Infrastructure              │  ← Adapters
│  - Platform API Adapters (fetch, Date)  │     (depends on Domain - implements interfaces)
│  - External Service Implementations     │
├─────────────────────────────────────────┤
│              Application                │  ← Use Cases
│  - Use Cases, Workflows, Interceptors   │     (depends on Domain only)
├─────────────────────────────────────────┤
│                Domain                   │  ← Core Business
│  - Interfaces, Value Objects, Logic     │     (no dependencies)
└─────────────────────────────────────────┘

         Dependency Flow (inner → outer)
                     ↑
         Outer layers depend on inner layers
         Inner layers NEVER depend on outer layers
```

**Allowed Dependencies:**
- ✅ Presentation → DI, Infrastructure, Application, Domain
- ✅ DI → Infrastructure, Domain
- ✅ Infrastructure → Domain (implements interfaces)
- ✅ Application → Domain
- ✅ Domain → Nothing

**Forbidden Dependencies:**
- ❌ Domain → Application, Infrastructure, DI, Presentation
- ❌ Application → Infrastructure, DI, Presentation
- ❌ Infrastructure → Application, DI, Presentation
- ❌ DI → Presentation

**Layer Descriptions**:

### 1. Domain Layer (Core)
**Pure TypeScript, no dependencies**
- Business interfaces and contracts
- Value objects and domain types
- Pure business logic
- Framework-agnostic, platform-agnostic

**Example:**
```typescript
// lib/http/domain/http-client.interface.ts
export interface HttpClient {
  get<T>(url: string): Promise<HttpResponse<T>>;
  post<T>(url: string, body: unknown): Promise<HttpResponse<T>>;
}
```

**❌ What NOT to put here:**
- Angular imports (`@angular/*`)
- Platform APIs (`fetch`, `Date.now()`, `localStorage`)
- External library imports (`axios`, `lodash`)
- Concrete implementations (only interfaces and types)
- Side effects (file I/O, HTTP calls, timers)

### 2. Application Layer (Use Cases)
**Pure TypeScript, depends only on Domain**
- Use cases orchestrating domain logic
- Application services
- Interceptors and validators
- Complex business workflows

**Example:**
```typescript
// lib/http/application/interceptors/logger.http-interceptor.ts
export class LoggerHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest): Promise<HttpResponse> {
    console.log(`Request: ${request.method} ${request.url}`);
    return this.next.handle(request);
  }
}
```

**❌ What NOT to put here:**
- Platform API calls (`fetch()`, `Date.now()`, `performance.now()`)
- Angular-specific code (`@Injectable`, `inject()`, `signal()`)
- Concrete infrastructure implementations
- UI logic or component state

### 3. Infrastructure Layer (Adapters)
**Platform-specific, implements Domain interfaces**
- Adapters for platform APIs (fetch, Date, performance)
- External service implementations
- Data parsers and formatters

**Example:**
```typescript
// lib/http/infrastructure/fetch-http-client.adapter.ts
export class FetchHttpClientAdapter implements HttpClient {
  async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await fetch(url);
    return { data: await response.json(), status: response.status };
  }
}
```

**❌ What NOT to put here:**
- Angular-specific code (`InjectionToken`, `@Injectable`)
- Business logic (keep implementations thin)
- Use case orchestration (that's Application layer)

### 4. DI Layer (Dependency Injection Configuration)
**Angular-specific, wires up dependencies**
- Angular DI tokens
- Provider configurations
- Composition root

**Example:**
```typescript
// lib/http/di/http-client.provider.ts
export const HTTP_CLIENT = new InjectionToken<HttpClient>('HttpClient');

export const provideHttpClient = (): Provider[] => [{
  provide: HTTP_CLIENT,
  useClass: FetchHttpClientAdapter
}];
```

**❌ What NOT to put here:**
- Business logic (DI is for wiring, not logic)
- Infrastructure implementations (define them in infrastructure/)
- Complex initialization logic (keep providers simple)

### 5. Presentation Layer
**Angular-specific, orchestrates the app**
- Components, directives, pipes
- Routing configuration
- Application composition
**Note:** The `shell/` directory contains common UI elements and presentation logic, while `config/` contains technical setup and configuration files.
**Example:**
```typescript
// shell/app.component.ts
@Component({
  selector: 'app-root',
  template: '<router-outlet />'
})
export class AppComponent {}
```

**❌ What NOT to put here:**
- Business logic (move to Application or Domain)
- Direct platform API calls (use Infrastructure adapters)
- Complex validation (move to Application layer)
- Data transformations (use Application layer DTOs)

**Dependency Rules**:
- Domain → No dependencies
- Application → Domain only
- Infrastructure → Domain (implements interfaces)
- DI → Domain + Infrastructure (wiring)
- Presentation → Any layer (presentation orchestrates everything)

**Complete Feature Example: User Authentication**

Here's how a complete authentication feature flows through all layers:

```typescript
// 1. DOMAIN: Define contracts (no dependencies)
// lib/auth/domain/authenticator.ts
export interface Authenticator {
  authenticate(username: string, password: string): Promise<AuthResult>;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

// 2. APPLICATION: Orchestrate business logic (depends on Domain only)
// lib/auth/application/authenticate-user.use-case.ts
export class AuthenticateUserUseCase {
  constructor(private authenticator: Authenticator) {}

  async execute(username: string, password: string): Promise<AuthResult> {
    // Validation logic
    if (!username || !password) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Delegate to domain interface
    return this.authenticator.authenticate(username, password);
  }
}

// 3. INFRASTRUCTURE: Implement platform-specific adapter (depends on Domain)
// lib/auth/infrastructure/http-authenticator.adapter.ts
export class HttpAuthenticatorAdapter implements Authenticator {
  async authenticate(username: string, password: string): Promise<AuthResult> {
    // Platform API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const { token } = await response.json();
      return { success: true, token };
    }

    return { success: false, error: 'Authentication failed' };
  }
}

// 4. DI: Wire up dependencies (Angular-specific)
// lib/auth/di/authenticator.provider.ts
export const AUTHENTICATOR = new InjectionToken<Authenticator>('Authenticator');

export const provideAuthenticator = (): Provider[] => [{
  provide: AUTHENTICATOR,
  useClass: HttpAuthenticatorAdapter
}];

// 5. PRESENTATION: Use in component (Angular-specific)
// app/auth/presentation/login.component.ts
@Component({
  selector: 'app-login',
  template: `
    <form (submit)="onLogin()">
      <input [(ngModel)]="username" />
      <input [(ngModel)]="password" type="password" />
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  private useCase = inject(AuthenticateUserUseCase);

  async onLogin() {
    const result = await this.useCase.execute(this.username, this.password);
    if (result.success) {
      // Navigate to dashboard
    }
  }
}
```

**Benefits of this approach:**
- ✅ `AuthenticateUserUseCase` is testable with mocks (no Angular needed)
- ✅ Can swap `HttpAuthenticatorAdapter` with `MockAuthenticatorAdapter` for testing
- ✅ Business logic in use case is reusable in Node.js server
- ✅ Domain interfaces define clear contracts
- ✅ Each layer has a single, clear responsibility

**Consequences**:

**Benefits:**
- ✅ **Portability**: Business logic reusable across frameworks (React, Vue, Node.js)
- ✅ **Testability**: Core layers testable without Angular TestBed
- ✅ **Maintainability**: Clear separation of concerns and dependencies
- ✅ **Framework migration**: Only Presentation and DI layers need changes
- ✅ **Reasoning**: Easy to understand where code belongs
- ✅ **Flexibility**: Swap implementations without changing business logic

**Tradeoffs:**
- ⚠️ **Discipline required**: Team must maintain layer boundaries
- ⚠️ **Initial complexity**: More setup than monolithic approach
- ⚠️ **Learning curve**: Developers need to understand architecture principles
- ⚠️ **More files**: Separation creates additional files and folders
- ⚠️ **Indirection**: May feel over-engineered for simple features

**Implementation Notes**:
1. Follow the decision tree in [ADR-002](./002-layer-placement-decision-tree.md) when unsure about layer placement
2. Start with Domain layer when building new features
3. Infrastructure adapters should be thin wrappers around platform APIs
4. Keep Application layer focused on orchestration, not implementation
5. Use dependency analysis tools to enforce layer boundaries (see [ADR-007](./007-dependency-analysis-automation.md))

**Enforcing Architecture Boundaries:**

We use automated tools to prevent architecture violations:

1. **ESLint dependency-cruiser plugin**: Fails builds if layers violate dependency rules
   - Example: Domain importing from Infrastructure → Build fails
   - Configured in `.dependency-cruiser.js`

2. **Code review checklist**: Verify layer placement during PR reviews
   - Does this file belong in this layer?
   - Does it violate dependency rules?
   - Could it be framework-agnostic?

3. **Continuous monitoring**: Regular architecture health checks
   - Run `npm run check:dependencies` to validate boundaries
   - Monitor for drift in layer sizes (Domain should be largest)

**When architecture violations occur:**
- ❌ Don't ignore them - they compound over time
- ✅ Refactor immediately - move code to correct layer
- ✅ Ask team - if placement is unclear, discuss in PR
- ✅ Update ADRs - if rules need clarification, improve documentation

**Related ADRs**:
- [ADR-002: Layer Placement Decision Tree](./002-layer-placement-decision-tree.md) - Guidance for layer decisions
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - Detailed implementation of layered architecture
- [ADR-004: Framework-Agnostic Core](./004-framework-agnostic-core.md) - Why framework independence matters
- [ADR-005: Separate DI Layer](./005-separate-di-layer.md) - DI configuration strategy
- [ADR-006: Composition Root Pattern](./006-composition-root-pattern.md) - How DI configuration is composed
- [ADR-007: Dependency Analysis Automation](./007-dependency-analysis-automation.md) - Enforcing architecture boundaries

---

**Last Updated**: January 11, 2026
