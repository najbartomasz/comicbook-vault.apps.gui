# ADR-014: Native Fetch API for HTTP Client

**Status**: ✅ Accepted

**Context**:
The application needs an HTTP client for API communication that works in both browser and SSR (server-side rendering) environments without coupling to Angular's framework-specific HttpClient.

**Problems with Angular HttpClient:**

1. **Framework coupling**:
```typescript
// ❌ Infrastructure layer depends on Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserApiService {
  public constructor(private readonly http: HttpClient) {}

  public getUsers() {
    return this.http.get('/api/users');
  }
}
```

2. **RxJS dependency**:
```typescript
// ❌ Returns Observable, forces RxJS in infrastructure
this.http.get<User[]>('/api/users')
  .pipe(
    map(users => users.filter(u => u.active))
  )
  .subscribe(users => this.users.set(users));

// Infrastructure should return Promises, not Observables
```

3. **Testing complexity**:
```typescript
// ❌ Requires HttpClientTestingModule
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApiService]
    });
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
});
```

4. **SSR complications**:
```typescript
// ❌ Different behavior browser vs server
// Needs special configuration for Angular Universal
// Token injection varies between platforms
```

**Decision**:
Use **native Fetch API** wrapped in a framework-agnostic HTTP client abstraction in the infrastructure layer.

**Architecture:**

```
Presentation Layer (Angular)
      ↓ uses
Application Layer (Use Cases)
      ↓ uses
Domain Layer (Interfaces)
      ↑ implements
Infrastructure Layer (FetchHttpClient)
      ↓ uses
Native Fetch API
```

**Implementation:**

### 1. Domain Interface (Framework-Agnostic)
```typescript
// lib/http/domain/http-client.ts
export interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
  post<T>(url: string, body: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
  put<T>(url: string, body: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
  patch<T>(url: string, body: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
  delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
```

### 2. Infrastructure Implementation
```typescript
// lib/http/infrastructure/fetch-http-client.adapter.ts
import { HttpClient, HttpResponse, RequestOptions, HttpMethod } from '../domain/http-client';
import { NetworkError, TimeoutError, HttpError } from '../domain/errors';

export class FetchHttpClient implements HttpClient {
  public constructor(
    private readonly baseUrl: string = '',
    private readonly defaultHeaders: Record<string, string> = {}
  ) {}

  public async get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  public async post<T>(url: string, body: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, body, options);
  }

  public async put<T>(url: string, body: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, body, options);
  }

  public async patch<T>(url: string, body: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, body, options);
  }

  public async delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url);
    const headers = this.buildHeaders(options?.headers);

    // Handle timeout
    const controller = new AbortController();
    const signal = options?.signal ?? controller.signal;
    const timeoutId = options?.timeout
      ? setTimeout(() => controller.abort(), options.timeout)
      : undefined;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal
      });

      if (timeoutId) clearTimeout(timeoutId);

      // Parse response
      const data = await this.parseResponse<T>(response);

      // Check for HTTP errors
      if (!response.ok) {
        throw new HttpError(
          response.status,
          response.statusText,
          data
        );
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.extractHeaders(response.headers)
      };
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new TimeoutError(`Request to ${url} timed out`);
      }

      if (error instanceof HttpError) {
        throw error;
      }

      throw new NetworkError(`Network request failed: ${error.message}`);
    }
  }

  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseUrl}${url}`;
  }

  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
      ...customHeaders
    };
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    if (contentType?.includes('text/')) {
      return response.text() as unknown as T;
    }

    return response.blob() as unknown as T;
  }

  private extractHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}
```

### 3. Error Types
```typescript
// lib/http/domain/errors.ts
export class HttpError extends Error {
  public constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'HttpError';
  }
}

export class NetworkError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}
```

### 4. Interceptor Pattern
```typescript
// lib/http/application/http-interceptor.ts
export interface HttpInterceptor {
  intercept(request: HttpRequest, next: HttpHandler): Promise<HttpResponse<unknown>>;
}

export interface HttpRequest {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: unknown;
}

export interface HttpHandler {
  handle(request: HttpRequest): Promise<HttpResponse<unknown>>;
}

// Example: Logging Interceptor
export class LoggingHttpInterceptor implements HttpInterceptor {
  public async intercept(request: HttpRequest, next: HttpHandler): Promise<HttpResponse<unknown>> {
    console.log(`[HTTP] ${request.method} ${request.url}`);
    const startTime = Date.now();

    try {
      const response = await next.handle(request);
      const duration = Date.now() - startTime;
      console.log(`[HTTP] ${request.method} ${request.url} - ${response.status} (${duration}ms)`);
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[HTTP] ${request.method} ${request.url} - ERROR (${duration}ms)`, error);
      throw error;
    }
  }
}

// Example: Auth Interceptor
export class AuthHttpInterceptor implements HttpInterceptor {
  public constructor(private readonly getToken: () => string | null) {}

  public async intercept(request: HttpRequest, next: HttpHandler): Promise<HttpResponse<unknown>> {
    const token = this.getToken();

    if (token) {
      request.headers = {
        ...request.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    return next.handle(request);
  }
}
```

### 5. Provider Configuration
```typescript
// app-providers/http-client/http-client.provider.ts
import { type Provider } from '@angular/core';
import { HttpClient } from '@lib/http-client/domain';
import { FetchHttpClient } from '@lib/http-client/infrastructure';

export const provideHttpClient = (): Provider => ({
  provide: HttpClient,  // Class-based token
  useFactory: () => new FetchHttpClient(
    'http://localhost:3000/api',  // Base URL from config
    { 'X-App-Version': '1.0.0' }   // Default headers
  )
});
];
```

### 6. Usage in Application Layer
```typescript
// app/comics/application/get-comics.use-case.ts
import { HttpClient } from '@/lib/http/domain/http-client';
import { Comic } from '../domain/comic';

export class GetComicsUseCase {
  public constructor(private readonly httpClient: HttpClient) {}

  public async execute(): Promise<Comic[]> {
    try {
      const response = await this.httpClient.get<Comic[]>('/comics');
      return response.data;
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return [];  // No comics found
      }
      throw error;
    }
  }
}
```

### 7. Usage in Presentation Layer
```typescript
// app/comics/presentation/comic-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { GetComicsUseCase } from '../application/get-comics.use-case';

@Component({
  selector: 'app-comic-list',
  standalone: true,
  template: `
    <div *ngIf="loading()">Loading...</div>
    <div *ngFor="let comic of comics()">{{ comic.title }}</div>
  `
})
export class ComicListComponent {
  public comics = signal<Comic[]>([]);
  public loading = signal(false);

  private readonly getComicsUseCase = inject(GetComicsUseCase);

  public async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const comics = await this.getComicsUseCase.execute();
      this.comics.set(comics);
    } finally {
      this.loading.set(false);
    }
  }
}
```

**Testing:**

```typescript
// lib/http/infrastructure/fetch-http-client.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FetchHttpClient } from './fetch-http-client.adapter';

describe('FetchHttpClient', () => {
  let client: FetchHttpClient;

  beforeEach(() => {
    client = new FetchHttpClient('http://api.example.com');

    // Mock global fetch
    globalThis.fetch = vi.fn();
  });

  it('should make GET request', async () => {
    const mockData = { id: 1, name: 'Test' };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockData
    } as Response);

    const response = await client.get('/users/1');

    expect(fetch).toHaveBeenCalledWith(
      'http://api.example.com/users/1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
    expect(response.data).toEqual(mockData);
  });

  it('should handle timeout', async () => {
    vi.mocked(fetch).mockImplementation(
      () => new Promise((_, reject) =>
        setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 100)
      )
    );

    await expect(
      client.get('/slow-endpoint', { timeout: 50 })
    ).rejects.toThrow(TimeoutError);
  });

  it('should throw HttpError on 404', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      json: async () => ({ error: 'User not found' })
    } as Response);

    await expect(
      client.get('/users/999')
    ).rejects.toThrow(HttpError);
  });
});
```

**Benefits for Layered Architecture:**

```typescript
// ✅ Domain layer - pure interfaces
// lib/http/domain/http-client.ts
export interface HttpClient {
  get<T>(url: string): Promise<HttpResponse<T>>;
}
// No framework dependencies, can run anywhere

// ✅ Infrastructure layer - platform adapter
// lib/http/infrastructure/fetch-http-client.ts
export class FetchHttpClient implements HttpClient {
  public async get<T>(url: string) {
    const response = await fetch(url);  // Platform API
    return { data: await response.json(), status: response.status };
  }
}
// Framework-agnostic, uses native fetch

// ✅ Application layer - business logic
// app/users/application/get-users.use-case.ts
export class GetUsersUseCase {
  public constructor(private readonly http: HttpClient) {}  // Depends on interface

  public async execute() {
    const response = await this.http.get<User[]>('/users');
    return response.data.filter(u => u.active);
  }
}
// No Angular, no RxJS, pure TypeScript

// ✅ Can test without Angular
import { vi } from 'vitest';

const mockHttp = {
  get: vi.fn().mockResolvedValue({
    data: [{ id: 1, active: true }]
  })
};

const useCase = new GetUsersUseCase(mockHttp);
// Simple, fast, no framework needed
```

**SSR Support:**

```typescript
// Works in both browser and Node.js (18+)
// No special configuration needed

// Browser: uses native window.fetch
// Node.js: uses built-in fetch (Node 18+)
// Deno: uses native fetch

// Same code runs everywhere!
const client = new FetchHttpClient('https://api.example.com');
const users = await client.get<User[]>('/users');
```

**Advanced Features:**

### Request Cancellation
```typescript
const controller = new AbortController();

const request = client.get('/slow-endpoint', {
  signal: controller.signal
});

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

### Retry Logic
```typescript
// application/retry-http-client.ts
export class RetryHttpClient implements HttpClient {
  public constructor(
    private readonly client: HttpClient,
    private readonly maxRetries: number = 3
  ) {}

  public async get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    let lastError: Error;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await this.client.get<T>(url, options);
      } catch (error) {
        lastError = error;
        if (error instanceof HttpError && error.status < 500) {
          throw error;  // Don't retry client errors
        }
        // Wait before retry (exponential backoff)
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**Rationale**:
- 🌐 **Native browser API**: No external dependency, works everywhere
- 🚀 **Node.js 18+ support**: Built-in fetch, SSR works out-of-the-box
- 🔄 **SSR compatible**: Same code runs in browser and server
- 📦 **Zero bundle overhead**: No library to download
- 🎯 **Modern Promise API**: Simpler than Observables for HTTP
- 🔌 **Framework-agnostic**: Aligns perfectly with layered architecture
- 🧪 **Easy to test**: Simple mocking with Vitest
- 💪 **TypeScript support**: Fetch API has excellent TypeScript types
- 🏗️ **Architecture-friendly**: Infrastructure layer stays pure
- ⚡ **Performance**: Native implementation is fastest

**Consequences**:
- ✅ Framework-independent HTTP layer (can reuse in Node.js, Deno)
- ✅ No additional dependencies (reduces bundle size)
- ✅ SSR works without special configuration
- ✅ Simple to test and mock (no HttpTestingController needed)
- ✅ Promise-based API (cleaner than Observables for simple requests)
- ✅ Aligns with architecture (infrastructure implements domain interface)
- ✅ Works with signals (no need for async pipe)
- ⚠️ Must handle edge cases manually (timeouts, retries)
- ⚠️ No built-in interceptor chain (must implement if needed)
- ⚠️ Requires Node.js 18+ for SSR (older versions need polyfill)

**Alternatives Considered**:

1. **Angular HttpClient**
   - ❌ Rejected: Tightly couples infrastructure to Angular
   - ❌ Breaks framework-agnostic architecture goal
   - ❌ Returns Observables (forces RxJS in infrastructure)
   - ❌ Complex testing with HttpTestingController

2. **Axios** (popular HTTP library)
   - ❌ Rejected: Adds 30KB to bundle size
   - ❌ External dependency to maintain
   - ❌ Couples infrastructure to specific library
   - ✅ Better error handling and interceptors out-of-box
   - ⚠️ Could migrate later if complexity demands it

3. **ky** (lightweight fetch wrapper)
   - ❌ Rejected: Adds 10KB dependency
   - ❌ Another library to learn
   - ✅ Good TypeScript support
   - ⚠️ Native fetch is sufficient for current needs

4. **Wretch** (tiny fetch wrapper)
   - ❌ Rejected: Still an external dependency
   - ❌ Less popular, smaller community

**Migration Path:**

If complexity grows and interceptor chains become essential:

```typescript
// Easy to swap implementation
// DI configuration:
export const provideHttpClient = (): Provider => ({
  provide: HttpClient,
  // useClass: FetchHttpClient      // Current
  useClass: AxiosHttpClient          // Future if needed
});

// Application and domain layers unchanged!
// Only swap infrastructure adapter
```

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Fetch client is infrastructure adapter
- [ADR-004: Framework-Agnostic Core](./004-framework-agnostic-core.md) - Why HTTP client must be framework-agnostic
- [ADR-006: Composition Root Pattern](./006-composition-root-pattern.md) - Updated for app-providers pattern
- [ADR-013: Signals for State Management](./013-signals-for-state-management.md) - Promises work seamlessly with signals

---

**Last Updated**: January 18, 2026
