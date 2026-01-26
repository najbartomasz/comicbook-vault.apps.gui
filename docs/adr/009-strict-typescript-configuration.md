# ADR-009: Strict TypeScript Configuration

**Status**: ✅ Accepted

**Context**:
TypeScript offers various levels of type safety. Without strict mode, many runtime errors slip through compilation, defeating the purpose of using TypeScript.

**Problems Without Strict Mode:**

1. **Implicit `any` types** hide type errors:
```typescript
// ❌ Without strict - compiles but breaks at runtime
function getUser(id) {  // id is implicitly 'any'
  return users[id];     // What if id is undefined?
}

getUser(undefined);  // Runtime error! ✅ Compiles fine
```

2. **Null/undefined not caught**:
```typescript
// ❌ Without strictNullChecks
interface User {
  name: string;
}

function greet(user: User | null) {
  return user.name.toUpperCase();  // ✅ Compiles, ❌ crashes if user is null
}
```

3. **Missing function returns**:
```typescript
// ❌ Without noImplicitReturns
function calculateDiscount(age: number): number {
  if (age > 65) {
    return 0.2;
  }
  // ✅ Compiles, but missing return for age <= 65
}
```

4. **Unsafe `this` binding**:
```typescript
// ❌ Without noImplicitThis
class Counter {
  public count = 0;

  public increment() {
    setTimeout(function() {
      this.count++;  // ✅ Compiles, 'this' is undefined at runtime
    }, 1000);
  }
}
```

5. **Unused variables/parameters**:
```typescript
// ❌ Without noUnused* checks
function processUser(id: number, name: string, email: string) {
  console.log(name);  // ✅ Compiles, but 'id' and 'email' unused (typo? refactoring leftover?)
}
```

**Decision**:
Enable **strict mode** and all recommended strict flags in TypeScript configuration across the entire project.

**TypeScript Configuration**:

```json
// tsconfig.json
{
  "compilerOptions": {
    // === Strict Mode ===
    "strict": true,                          // Enables all strict flags below

    // === Individual Strict Flags ===
    // (enabled by "strict": true, listed for documentation)
    "strictNullChecks": true,               // null/undefined must be handled explicitly
    "strictFunctionTypes": true,            // Function parameter types checked contravariantly
    "strictBindCallApply": true,            // Bind/call/apply methods strictly typed
    "strictPropertyInitialization": true,   // Class properties must be initialized
    "noImplicitAny": true,                  // Error on expressions/declarations with 'any' type
    "noImplicitThis": true,                 // Error on 'this' with implied 'any' type
    "alwaysStrict": true,                   // Parse in strict mode, emit "use strict"

    // === Additional Strict Checks ===
    "noUnusedLocals": true,                 // Error on unused local variables
    "noUnusedParameters": true,             // Error on unused function parameters
    "noImplicitReturns": true,              // Error when not all code paths return value
    "noFallthroughCasesInSwitch": true,     // Error on fallthrough in switch statements
    "noUncheckedIndexedAccess": true,       // Add 'undefined' to index signature results
    "noImplicitOverride": true,             // Require 'override' keyword in subclasses
    "noPropertyAccessFromIndexSignature": true,  // Require indexed access for dynamic properties

    // === Type Safety ===
    "exactOptionalPropertyTypes": true,     // Optional properties cannot be set to 'undefined'
    "allowUnusedLabels": false,             // Error on unused labels
    "allowUnreachableCode": false,          // Error on unreachable code

    // === Module Resolution ===
    "esModuleInterop": true,                // Better CommonJS/ESM interop
    "forceConsistentCasingInFileNames": true,  // Enforce consistent file name casing
    "skipLibCheck": true                    // Skip type checking of declaration files
  }
}
```

**What Each Flag Does**:

### Core Strict Flags:

#### 1. `strictNullChecks`
Forces explicit handling of `null` and `undefined`:

```typescript
// ❌ Without strictNullChecks
function getUserName(user: User | null): string {
  return user.name;  // ✅ Compiles - crashes at runtime if user is null
}

// ✅ With strictNullChecks
function getUserName(user: User | null): string {
  return user?.name ?? 'Unknown';  // ❌ Error: user might be null
  // Must handle null explicitly
}
```

#### 2. `noImplicitAny`
Prevents implicit `any` types:

```typescript
// ❌ Without noImplicitAny
function process(data) {  // 'data' is implicitly 'any' - compiles
  return data.value;      // No type safety
}

// ✅ With noImplicitAny
function process(data: unknown) {  // ❌ Error: must specify type
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as any).value;  // Type narrowing required
  }
}
```

#### 3. `strictPropertyInitialization`
Requires class properties to be initialized:

```typescript
// ❌ Without strictPropertyInitialization
class UserService {
  private httpClient: HttpClient;  // ✅ Compiles - undefined at runtime!

  public setClient(client: HttpClient) {
    this.httpClient = client;
  }
}

// ✅ With strictPropertyInitialization
class UserService {
  private httpClient: HttpClient;  // ❌ Error: not initialized

  // Fix 1: Initialize in constructor
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }
}
```

### Additional Strict Checks:

#### 4. `noUnusedLocals` / `noUnusedParameters`
Catches unused variables and parameters:

```typescript
// ❌ With noUnusedLocals/Parameters
function calculateTotal(price: number, tax: number, discount: number) {
  const markup = 1.1;  // ❌ Error: 'markup' is declared but never used
  return price + tax;  // ❌ Error: 'discount' is declared but never used
}

// ✅ Fixed
function calculateTotal(price: number, tax: number) {
  return price + tax;
}

// ✅ Or prefix with _ to indicate intentionally unused
function onClick(_event: MouseEvent, handler: () => void) {
  handler();  // 'event' intentionally unused, prefixed with _
}
```

#### 5. `noImplicitReturns`
Ensures all code paths return a value:

```typescript
// ❌ With noImplicitReturns
function getDiscount(age: number): number {
  if (age > 65) {
    return 0.2;
  }
  if (age < 18) {
    return 0.1;
  }
  // ❌ Error: not all code paths return a value
}

// ✅ Fixed
function getDiscount(age: number): number {
  if (age > 65) {
    return 0.2;
  }
  if (age < 18) {
    return 0.1;
  }
  return 0;  // Default case
}
```

#### 6. `noUncheckedIndexedAccess`
Adds `undefined` to index signature results:

```typescript
// ❌ Without noUncheckedIndexedAccess
const users: Record<string, User> = {};
const user = users['unknown'];  // Type: User (wrong!)
user.name.toUpperCase();        // ✅ Compiles - crashes at runtime

// ✅ With noUncheckedIndexedAccess
const users: Record<string, User> = {};
const user = users['unknown'];  // Type: User | undefined (correct!)
if (user) {
  user.name.toUpperCase();  // ✅ Safe
}
```

**Benefits for Layered Architecture**:

### Domain Layer
Strict mode ensures pure business logic is type-safe:

```typescript
// ✅ domain/user-validator.ts
export class UserValidator {
  // ✅ strictNullChecks ensures we handle null emails
  public isValidEmail(email: string | null): boolean {
    if (!email) return false;  // Must check null
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ✅ noImplicitReturns catches missing return paths
  public validateAge(age: number): boolean {
    if (age < 0) return false;
    if (age > 150) return false;
    return true;  // Required - can't forget this
  }
}
```

### Application Layer
Catches orchestration errors:

```typescript
// ✅ application/authenticate-user.use-case.ts
export class AuthenticateUserUseCase {
  constructor(
    private authenticator: Authenticator,  // ✅ Must be initialized (strictPropertyInitialization)
    private logger: Logger
  ) {}

  // ✅ noImplicitReturns ensures we return AuthResult in all cases
  public async execute(username: string, password: string): Promise<AuthResult> {
    if (!username || !password) {
      return { success: false, error: 'Missing credentials' };
    }

    const result = await this.authenticator.authenticate(username, password);
    this.logger.log('Authentication attempt', result);

    return result;  // Required - can't forget
  }
}
```

### Infrastructure Layer
Prevents platform API misuse:

```typescript
// ✅ infrastructure/fetch-http-client.ts
export class FetchHttpClient implements HttpClient {
  // ✅ strictNullChecks catches potential null response
  public async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await fetch(url);
    if (!response.ok) {  // Must check - might be null/error
      throw new NetworkError(response.statusText);
    }
    const data = await response.json();  // ✅ Type-safe
    return { data, status: response.status };
  }
}
```

**Common Patterns with Strict Mode**:

### 1. Handling Nullable Values
```typescript
// Optional chaining
const name = user?.profile?.name;

// Nullish coalescing
const displayName = user?.name ?? 'Anonymous';

// Type guards
if (user !== null && user !== undefined) {
  console.log(user.name);
}
```

### 2. Type Narrowing
```typescript
function processValue(value: string | number | null) {
  if (typeof value === 'string') {
    return value.toUpperCase();  // TypeScript knows it's string
  }
  if (typeof value === 'number') {
    return value.toFixed(2);     // TypeScript knows it's number
  }
  return 'N/A';                  // TypeScript knows it's null
}
```

### 3. Discriminated Unions
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data);   // TypeScript knows 'data' exists
  } else {
    console.error(result.error); // TypeScript knows 'error' exists
  }
}
```

### 4. Assertion Functions
```typescript
function assertIsDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Value must be defined');
  }
}

const user: User | null = getUser();
assertIsDefined(user);
console.log(user.name);  // TypeScript knows user is not null
```

**Migration Strategy**:

If enabling strict mode in an existing project:

1. **Enable flags incrementally**:
```json
{
  "compilerOptions": {
    // Start with these
    "noImplicitAny": true,
    "strictNullChecks": false,  // Enable later

    // Then add
    "strictNullChecks": true,
    "strictFunctionTypes": true,

    // Finally enable all
    "strict": true
  }
}
```

2. **Fix errors by priority**:
   - Critical paths first (auth, payments)
   - Domain layer (pure logic, easy to fix)
   - Infrastructure layer
   - Presentation layer last

3. **Use `@ts-expect-error` temporarily**:
```typescript
// @ts-expect-error - TODO: Fix after migration
const user = unsafeGetUser();
```

**Rationale**:
- 🐛 **Prevents bugs**: Catches 15-20% of runtime errors at compile time
- 💡 **Better IDE**: Autocomplete knows exact types, not 'any'
- 📚 **Self-documenting**: Types serve as inline documentation
- 🔧 **Safer refactoring**: Compiler catches breaking changes
- 🏗️ **Architecture enforcement**: Type system enforces layer boundaries
- 🧪 **Easier testing**: Less defensive coding needed in tests
- 👥 **Team alignment**: Types communicate intent clearly

**Consequences**:
- ✅ 15-20% of runtime errors caught at compile time
- ✅ Better IDE autocomplete and IntelliSense
- ✅ Self-documenting code through explicit types
- ✅ Safer refactoring (compiler finds breaking changes)
- ✅ Enforces architectural boundaries via type system
- ✅ Reduces defensive coding (trust the types)
- ✅ Easier onboarding (types explain intent)
- ⚠️ Initial development takes 10-15% longer (writing types)
- ⚠️ Stricter null checks require explicit handling (`?.`, `??`)
- ⚠️ Migration of existing code can be time-consuming
- ⚠️ Some third-party libraries have incomplete types

**Alternatives Considered**:

1. **Loose TypeScript (no strict mode)**
   - ❌ Rejected: Defeats purpose of using TypeScript
   - ❌ Runtime errors slip through compilation
   - ❌ 'any' everywhere makes code untyped JavaScript

2. **Gradual strict mode adoption**
   - ✅ Acceptable for legacy projects
   - ⚠️ Use `strict: true` from day one for new projects

3. **JSDoc + JavaScript**
   - ❌ Rejected: Not enforced, easily ignored
   - ❌ No compile-time checking

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Type system enforces layer boundaries
- [ADR-004: Framework-Agnostic Core](./004-framework-agnostic-core.md) - Pure TypeScript benefits from strict mode
- [ADR-007: Dependency Analysis Automation](./007-dependency-analysis-automation.md) - Complements static type checking

---

**Last Updated**: January 18, 2026
