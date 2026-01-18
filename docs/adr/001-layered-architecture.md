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

 Dependency Flow (Outer → Inner)
             ↓
 Outer layers depend on inner layers
 Inner layers NEVER depend on outer layers
```

**Allowed Dependencies:**
- ✅ Presentation → Infrastructure, Application, Domain
- ✅ Infrastructure → Domain (implements interfaces)
- ✅ Application → Domain
- ✅ Domain → Nothing

**Forbidden Dependencies:**
- ❌ Domain → Application, Infrastructure, Presentation
- ❌ Application → Infrastructure, Presentation
- ❌ Infrastructure → Application, Presentation

**Layer Descriptions**:

### 1. Presentation Layer
**Angular-specific, orchestrates the app**
- Components, directives, pipes
- Routing configuration
- Application composition
**Note:** Segregate UI components by feature or in a shared UI library.
```typescript
// ✅ presentation/user-profile.component.ts
@Component({
  selector: 'app-user-profile',
  template: '<div>{{ user().name }}</div>',
  standalone: true
})
export class UserProfileComponent {
  public readonly user = input.required<User>();
}
```

**❌ What NOT to put here:**
- Business logic (move to Domain)
- Direct platform API calls (use Infrastructure adapters)
- Complex validation (move to Application layer)
- Data transformations (use Application layer DTOs)

### 2. Infrastructure Layer (Adapters)
**Platform-specific, implements Domain interfaces**
- Adapters for platform APIs (fetch, Date, performance)
- External service implementations
- Data parsers and formatters

**Example:**
```typescript
// ✅ infrastructure/browser-storage.adapter.ts
export class BrowserStorageAdapter implements StoragePort {
  public save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
```

**❌ What NOT to put here:**
- Angular-specific code (`InjectionToken`, `@Injectable`)
- Business logic (keep implementations thin)
- Use case orchestration (that's Application layer)

### 3. Application Layer (Use Cases)
**Pure TypeScript, depends only on Domain**
- Use cases orchestrating domain logic
- Application services
- Interceptors and validators
- Complex business workflows

**Example:**
```typescript
// ✅ application/login.use-case.ts
export class LoginUseCase {
  constructor(private authService: AuthService) {}

  public async execute(credentials: Credentials): Promise<void> {
    if (!credentials.isValid()) {
       throw new ValidationError('Invalid credentials');
    }
    await this.authService.login(credentials);
  }
}
```

**❌ What NOT to put here:**
- Platform API calls (`fetch()`, `Date.now()`, `performance.now()`)
- Angular-specific code (`@Injectable`, `inject()`, `signal()`)
- Concrete infrastructure implementations
- UI logic or component state

### 4. Domain Layer (Core)
**Pure TypeScript, no dependencies**
- Business interfaces and contracts
- Value objects and domain types
- Pure business logic
- Framework-agnostic, platform-agnostic

**Example:**
```typescript
// ✅ domain/user.interface.ts
export interface User {
  id: string;
  email: string;
  hasRole(role: string): boolean;
}
```

**❌ What NOT to put here:**
- Angular imports (`@angular/*`)
- Platform APIs (`fetch`, `Date.now()`, `localStorage`)
- External library imports (`axios`, `lodash`)
- Concrete implementations (only interfaces and types)
- Side effects (file I/O, HTTP calls, timers)

**Dependency Rules**:
- Domain → No dependencies
- Application → Domain only
- Infrastructure → Domain (implements interfaces)
- Presentation → Any layer (presentation orchestrates everything)

**Consequences**:

**Benefits:**
- ✅ **Portability**: Business logic reusable across frameworks (React, Vue, Node.js)
- ✅ **Testability**: Core layers testable without Angular TestBed
- ✅ **Maintainability**: Clear separation of concerns and dependencies
- ✅ **Framework migration**: Only Presentation layer needs changes
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

1. **ESLint and dependency-cruiser**: Fails builds if layers violate dependency rules
   - Example: Domain importing from Infrastructure → Build fails
   - Configured in `eslint.config.mjs` and `.dependency-cruiser.js`

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
- [ADR-006: Composition Root Pattern](./006-composition-root-pattern.md) - How DI configuration is composed
- [ADR-007: Dependency Analysis Automation](./007-dependency-analysis-automation.md) - Enforcing architecture boundaries

---

**Last Updated**: January 18, 2026
