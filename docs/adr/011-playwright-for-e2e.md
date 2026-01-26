# ADR-011: Playwright for E2E Testing

**Status**: ✅ Accepted

**Context**:
End-to-end (E2E) tests validate the entire application from the user's perspective, ensuring features work correctly in real browsers. We need a reliable, fast E2E testing solution that:

**Problems with Traditional E2E Tools:**

1. **Protractor (Angular's legacy tool)**:
   - ❌ Officially deprecated (end of life)
   - ❌ Built on WebDriver (slow, unreliable)
   - ❌ Flaky tests due to poor waiting mechanisms

2. **Selenium WebDriver**:
   - ❌ Slow test execution (browser automation overhead)
   - ❌ Flaky tests (manual waits, race conditions)
   - ❌ Complex setup and configuration
   - ❌ Poor developer experience (debugging is painful)

3. **Cypress**:
   - ❌ Runs tests inside the browser (limits multi-tab testing)
   - ❌ Cannot test multiple domains in one test
   - ❌ No native iframe support
   - ❌ Limited browser support (Chromium-based only until recently)
   - ❌ Difficult to test file downloads/uploads

**Decision**:
Use **Playwright** as the primary end-to-end testing framework for cross-browser, reliable UI testing.

**Why Playwright?**

### 1. Fast and Reliable
```typescript
// ✅ Auto-waits for elements (no manual waits needed)
test('user can login', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  // Auto-waits for element to be visible and enabled
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Auto-waits for navigation
  await expect(page).toHaveURL(/dashboard/);
});
```

### 2. Multi-Browser Support
```typescript
// ✅ Test in Chromium, Firefox, and WebKit (Safari)
import { test } from '@playwright/test';

test('works in all browsers', async ({ page, browserName }) => {
  // Runs 3 times: once in each browser
  console.log(`Testing in ${browserName}`);
  await page.goto('/');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

### 3. Powerful Debugging
```bash
# Record test execution with trace
npx playwright test --trace on

# Open trace viewer to inspect test
npx playwright show-trace trace.zip

# Features:
# - Network requests/responses
# - DOM snapshots at each step
# - Console logs
# - Screenshots at each action
```

### 4. Modern Web Features
```typescript
// ✅ Multiple tabs/windows
test('multi-tab workflow', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto('/app');
  await page2.goto('/admin');
});

// ✅ File downloads
test('download file', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:text("Download")');
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
});

// ✅ File uploads
test('upload file', async ({ page }) => {
  await page.setInputFiles('input[type="file"]', 'test.pdf');
});

// ✅ Network interception
test('mock API response', async ({ page }) => {
  await page.route('/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, name: 'Test User' }])
    });
  });
  await page.goto('/users');
});
```

### 5. Mobile Testing
```typescript
// ✅ Test on mobile devices
import { devices } from '@playwright/test';

test.use(devices['iPhone 13']);

test('mobile responsive', async ({ page }) => {
  await page.goto('/');
  // Test runs in iPhone 13 viewport and user agent
});
```

**Test Structure**:

E2E tests are separate from unit/integration tests:

```
e2e/
  auth/
    login.spec.ts           ← Login flow
    signup.spec.ts          ← Signup flow
  products/
    browse-products.spec.ts ← Browse products catalog
    product-details.spec.ts ← View product details
  fixtures/
    auth.ts                 ← Reusable auth helpers
    test-data.ts            ← Test data generators
  playwright.config.ts      ← Playwright configuration
```

**Configuration**:

```typescript
// e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  // Run tests in parallel
  fullyParallel: true,

  // Fail build on CI if tests were skipped
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'e2e-report' }],
    ['list'],
  ],

  // Shared settings
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Test in multiple browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Start dev server before tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Page Object Model**:

Organize E2E tests using Page Object Model for maintainability:

```typescript
// ✅ Page Object Model implementation
// e2e/pages/login.page.ts
export class LoginPage {
  public constructor(private page: Page) {}

  public async goto() {
    await this.page.goto('/login');
  }

  public async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  public async expectLoginError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}

// e2e/auth/login.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('testuser', 'password123');

    await expect(page).toHaveURL(/dashboard/);
  });

  test('invalid credentials show error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('baduser', 'badpass');

    await loginPage.expectLoginError('Invalid credentials');
  });
});
```

**Fixtures for Reusable Setup**:

```typescript
// ✅ Reusable setup fixtures
// e2e/fixtures/auth.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

export const test = base.extend({
  // Authenticated user fixture
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser', 'password123');

    // Pass authenticated page to test
    await use(page);
  },
});

// e2e/products/browse-products.spec.ts
import { test } from '../fixtures/auth';

test('browse products as authenticated user', async ({ authenticatedPage }) => {
  // Already logged in!
  await authenticatedPage.goto('/products');
  await expect(authenticatedPage.getByRole('heading', { name: 'Products' })).toBeVisible();
});
```

**Running E2E Tests**:

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test e2e/auth/login.spec.ts

# Run in specific browser
npx playwright test --project=chromium

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Run with UI mode (interactive)
npx playwright test --ui

# Generate test code (codegen)
npx playwright codegen http://localhost:4200
```

**CI/CD Integration**:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: e2e-report/
```

**Best Practices**:

1. **Use data-testid for selectors**:
```typescript
// ✅ stable selector
await page.click('[data-testid="login-button"]');

// ❌ fragile selector (breaks if text changes)
await page.click('button:text("Log In")');
```

2. **Test user flows, not implementation**:
```typescript
// ✅ tests user flow
test('user can add product to cart', async ({ page }) => {
  await page.goto('/products/1');
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.getByText('Added to cart')).toBeVisible();
});

// ❌ tests implementation details
test('add button calls API', async ({ page }) => {
  const apiCalled = false;
  // Don't test API calls in E2E - test behavior
});
```

3. **Avoid hard-coded waits**:
```typescript
// ❌ brittle timing
await page.click('button');
await page.waitForTimeout(3000); // What if it takes 4 seconds?

// ✅ wait for specific condition
await page.click('button');
await expect(page.getByText('Success')).toBeVisible();
```

4. **Isolate tests**:
```typescript
// ✅ Each test should be independent
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/');
});

test('test 1', async ({ page }) => {
  // Doesn't depend on test 2
});

test('test 2', async ({ page }) => {
  // Doesn't depend on test 1
});
```

**E2E vs Integration vs Unit**:

| Aspect | Unit (Vitest) | Integration (Vitest) | E2E (Playwright) |
|--------|--------------|---------------------|------------------|
| Scope | Single function/class | Multiple layers | Full application |
| Speed | ⚡ < 1ms | 🐢 10-100ms | 🐌 1-10s |
| Browser | No | No | Yes (real browser) |
| Network | Mocked | Can be real or mocked | Real |
| Coverage | Functions | Layer interactions | User workflows |
| Flakiness | Very stable | Stable | Can be flaky |
| When to use | Pure logic | Business flows | Critical user paths |

**Rationale**:
- 🚀 **Fast**: Parallel execution, efficient browser automation
- 🎭 **Multi-browser**: Test in Chromium, Firefox, WebKit (Safari)
- 🔍 **Debugging**: Trace viewer with DOM snapshots, network logs, screenshots
- 📱 **Mobile**: Built-in device emulation for responsive testing
- 🛡️ **Reliable**: Auto-wait and retry mechanisms reduce flakiness
- 🧪 **Integrated**: Works with Vitest via @vitest/browser for unified tooling
- 🌐 **Modern**: File uploads/downloads, multi-tab, iframes, network mocking
- 📊 **Reporting**: HTML reports, screenshots, videos, traces
- 🤖 **Codegen**: Record interactions to generate test code
- 🏗️ **Framework-agnostic**: Tests user behavior, not framework internals

**Consequences**:
- ✅ Reliable cross-browser E2E tests (Chromium, Firefox, WebKit)
- ✅ Faster test execution than Selenium (parallel, efficient)
- ✅ Better debugging with trace viewer (DOM snapshots, network logs)
- ✅ Consistent tooling with Vitest integration
- ✅ Modern web features supported (multi-tab, file upload/download)
- ✅ Framework-agnostic tests (align with layered architecture)
- ✅ Mobile device testing without real devices
- ✅ Codegen tool speeds up test creation
- ⚠️ Learning curve for team members familiar with Protractor/Cypress
- ⚠️ E2E tests are slower than unit tests (run separately in CI)
- ⚠️ Requires running application (webServer in config)

**Alternatives Considered**:

1. **Cypress**
   - ❌ Rejected: Runs in browser (limits multi-tab, cross-domain testing)
   - ❌ Limited browser support (WebKit support is new)
   - ❌ Difficult file upload/download testing

2. **Selenium WebDriver**
   - ❌ Rejected: Slow, flaky, complex configuration
   - ❌ Poor developer experience and debugging

3. **Protractor**
   - ❌ Rejected: Officially deprecated by Angular team
   - ❌ Built on outdated WebDriver technology

4. **TestCafe**
   - ❌ Rejected: Less mature than Playwright
   - ❌ Smaller community and ecosystem

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Framework-agnostic architecture enables better E2E testing
- [ADR-009: Vitest over Jest](./009-vitest-over-jest.md) - Unit and integration testing strategy

---

**Last Updated**: January 18, 2026
