# ADR-009: Vitest over Jest

**Status**: ✅ Accepted

**Context**:
Testing framework-agnostic TypeScript code (Domain, Application, Infrastructure layers) requires a fast, modern test runner with excellent TypeScript and ESM support.

**Problems with Jest:**

1. **ESM Support**: Requires complex configuration with babel or ts-jest
   - Transform chains slow down test execution
   - Path mapping often breaks (tsconfig paths)
   - Experimental ESM mode is unstable

2. **Slow Startup**: Large test suites have 10-30 second startup time
   - Jest loads entire test suite before running
   - Cold start penalty on every run
   - Slows down TDD workflow

3. **TypeScript Support**: Requires additional dependencies
   - Need `ts-jest` or `babel-jest`
   - Type checking not built-in
   - Path aliases require manual configuration

4. **Mocking Complexity**: Heavy mocking API designed for older JS patterns
   - `jest.mock()` hoisting can be confusing
   - Module mocking breaks with ESM
   - Auto-mocking is magic and hard to debug

5. **Misalignment with Build Tools**: Different tooling than Vite (used in Angular 21+)
   - Separate configuration files
   - Different module resolution
   - Duplicate dependency resolution logic

**Decision**:
Use **Vitest** as the primary test runner for unit, integration, and visual tests.

**Why Vitest?**

### 1. Native ESM & TypeScript
```typescript
// ✅ Works out of the box - no configuration needed
import { describe, it, expect } from 'vitest';
import { AuthenticateUserUseCase } from '@/app/auth/application/authenticate-user.use-case';

describe('AuthenticateUserUseCase', () => {
  it('should authenticate valid user', () => {
    // TypeScript path aliases work automatically
    // ESM imports work automatically
  });
});
```

### 2. Instant Feedback with Watch Mode
```bash
# Vitest watch mode re-runs only changed tests
$ npm run test:watch

# ⚡ 23ms to re-run after code change (Jest: 3-5 seconds)
```

### 3. Jest-Compatible API
```typescript
// ✅ Same API as Jest - easy migration
import { describe, it, expect, vi } from 'vitest';

describe('UserValidator', () => {
  it('validates email format', () => {
    expect(validator.isValidEmail('test@example.com')).toBe(true);
  });

  it('mocks dependencies', () => {
    const mock = vi.fn();
    mock.mockReturnValue(42);
    expect(mock()).toBe(42);
  });
});
```

### 4. Browser Mode for Component Tests
```typescript
// ✅ Test Angular components in real browser (Playwright)
import { test, expect } from 'vitest';

test('LoginComponent renders form', async () => {
  // Runs in actual browser, not JSDOM
  const component = mount(LoginComponent);
  await expect(component.getByRole('button')).toBeVisible();
});
```

### 5. Built-in Coverage
```bash
$ npm run test:coverage

# ✅ V8 native coverage (faster than Istanbul)
# ✅ HTML, JSON, LCOV reports
# ✅ Branch, function, line coverage
```

**Test Structure**:

Our project uses three test types with Vitest:

```
src/
  app/
    auth/
      domain/
        authenticator.ts
        authenticator.spec.ts          ← Unit test (fast, pure logic)
      application/
        authenticate-user.use-case.ts
        authenticate-user.use-case.integration.spec.ts  ← Integration test
      infrastructure/
        http-authenticator.adapter.ts
        http-authenticator.adapter.spec.ts
      presentation/
        login.component.ts
        login.component.visual.spec.ts  ← Visual test (browser mode)
```

**Test Types:**

| Type | File Pattern | Purpose | Speed | Dependencies |
|------|-------------|---------|-------|--------------|
| Unit | `*.spec.ts` | Test pure logic | ⚡ Fast (< 1ms) | None (mocked) |
| Integration | `*.integration.spec.ts` | Test layer interactions | 🐢 Slower (10-100ms) | Real implementations |
| Visual | `*.visual.spec.ts` | Test UI rendering | 🐌 Slowest (100ms-1s) | Browser |

**Configuration**:

We maintain three Vitest configs for different test types:

```typescript
// vitest.unit.spec.config.ts - Pure logic tests
export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    exclude: ['**/*.integration.spec.ts', '**/*.visual.spec.ts'],
    environment: 'node', // Fast node environment
  }
});

// vitest.integration.spec.config.ts - Layer interaction tests
export default defineConfig({
  test: {
    include: ['**/*.integration.spec.ts'],
    environment: 'node',
    setupFiles: ['./src/testing/integration/setup.ts']
  }
});

// vitest.visual.spec.config.ts - Component tests
export default defineConfig({
  test: {
    include: ['**/*.visual.spec.ts'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright'
    }
  }
});
```

**Running Tests**:

```bash
# Run all tests
npm test

# Run only unit tests (fastest for TDD)
npm run test:unit

# Run integration tests
npm run test:integration

# Run visual tests (browser)
npm run test:visual

# Watch mode (re-run on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

**Layered Architecture Benefits**:

Vitest excels at testing our layered architecture:

```typescript
// ✅ domain/user-validator.spec.ts (Domain layer: Pure TypeScript, instant tests)
describe('UserValidator', () => {
  it('validates email', () => {
    expect(validator.isValidEmail('test@example.com')).toBe(true);
  });
  // ⚡ Runs in < 1ms, no framework needed
});

// ✅ application/authenticate-user.use-case.spec.ts (Application layer: Mock domain interfaces)
describe('AuthenticateUserUseCase', () => {
  it('calls authenticator', async () => {
    const mockAuthenticator = vi.fn();
    const useCase = new AuthenticateUserUseCase(mockAuthenticator);
    await useCase.execute('user', 'pass');
    expect(mockAuthenticator).toHaveBeenCalledWith('user', 'pass');
  });
  // ⚡ Mocks are fast, no Angular needed
});

// ✅ infrastructure/fetch-http-client.spec.ts (Infrastructure layer: Test platform integrations)
describe('FetchHttpClient', () => {
  it('makes GET request', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: 'test' })
    });
    const client = new FetchHttpClient();
    const result = await client.get('/api/test');
    expect(result.data).toBe('test');
  });
  // ✅ Can test fetch without Angular
});

// ✅ presentation/login.component.visual.spec.ts (Presentation layer: Visual tests in browser)
test('LoginComponent', async () => {
  const component = mount(LoginComponent);
  await expect(component.getByRole('button')).toBeVisible();
  // ✅ Real browser rendering
});
```

**Rationale**:
- ⚡ **Speed**: 10x faster startup than Jest (23ms vs 3-5 seconds)
- 📦 **Zero Config ESM**: Native ESM support, no babel/ts-jest needed
- 🔧 **Vite Integration**: Same tooling as Angular 21+ build system
- 🎯 **Jest Compatible**: Familiar API, easy migration from Jest projects
- 🌐 **Browser Mode**: Real browser testing with Playwright integration
- 📊 **Built-in Coverage**: V8 native coverage (faster than Istanbul)
- 🧪 **TypeScript First**: Path aliases and types work automatically
- 🏗️ **Architecture Friendly**: Perfect for testing layered architecture without framework overhead

**Consequences**:
- ✅ Faster test execution and development feedback (< 1ms for unit tests)
- ✅ Simplified configuration (no ESM transform, no ts-jest)
- ✅ Better TypeScript path mapping support (tsconfig paths work)
- ✅ Unified tooling with build system (Vite everywhere)
- ✅ Framework-agnostic layers are easy to test (no Angular TestBed needed)
- ✅ Watch mode is instant (only re-runs changed tests)
- ✅ Browser mode for real UI testing (not JSDOM)
- ⚠️ Smaller ecosystem than Jest (but growing rapidly)
- ⚠️ Team needs to learn subtle API differences (mostly compatible)
- ⚠️ Some Jest plugins don't have Vitest equivalents yet

**Alternatives Considered**:

1. **Jest**
   - ❌ Rejected: Slow startup, complex ESM configuration
   - ❌ Requires ts-jest and babel for TypeScript/ESM
   - ❌ Not aligned with Vite build tooling

2. **Karma (Angular default < v16)**
   - ❌ Rejected: Deprecated, very slow, requires browser for unit tests
   - ❌ Not suitable for framework-agnostic code

3. **Web Test Runner**
   - ❌ Rejected: Good for web components, but less mature than Vitest
   - ❌ Smaller community, less documentation

4. **Mocha + Chai**
   - ❌ Rejected: Requires more setup, no built-in mocking
   - ❌ Separate tools for coverage, mocking, assertions

**Migration from Jest**:

If migrating from Jest, changes are minimal:

```typescript
// Before (Jest)
import { jest } from '@jest/globals';
const mock = jest.fn();

// After (Vitest)
import { vi } from 'vitest';
const mock = vi.fn();

// Most tests work with just import changes!
```

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Why framework-agnostic testing matters
- [ADR-004: Framework-Agnostic Core](./004-framework-agnostic-core.md) - Testing pure TypeScript without Angular
- [ADR-010: Playwright for E2E](./010-playwright-for-e2e.md) - E2E testing strategy (complements Vitest)

---

**Last Updated**: January 18, 2026
