# ADR-012: Signals for State Management

**Status**: ✅ Accepted

**Context**:
Angular's reactivity evolved from Zone.js-based change detection to a signals-based system. Angular 21 is zoneless by default and embraces signals as the primary reactivity mechanism. We need a clear strategy for when to use signals vs RxJS observables.

**Problems with Zone.js + RxJS for All State:**

1. **Over-engineering simple state**:
```typescript
// ❌ RxJS for simple component state - overkill
export class UserProfileComponent {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Just to show/hide loading spinner!
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  public setUser(user: User): void {
    this.userSubject.next(user);
  }

  public setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}

// Template needs async pipe everywhere
<div *ngIf="loading$ | async">Loading...</div>
<div *ngIf="user$ | async as user">{{ user.name }}</div>
```

2. **Memory leaks**:
```typescript
// ❌ Easy to forget to unsubscribe
export class ComicListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.comicsService.comics$
      .pipe(takeUntil(this.destroy$))
      .subscribe(comics => this.comics = comics);

    // If you forget destroy$ or takeUntil → memory leak
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

3. **Unnecessary change detection**:
```typescript
// ❌ Zone.js triggers change detection on EVERY async operation
// Even if state didn't change
setTimeout(() => console.log('test'), 1000);  // Triggers CD
fetch('/api/data');  // Triggers CD
Promise.resolve();  // Triggers CD
```

4. **Confusing async state**:
```typescript
// ❌ Multiple observables = hard to track state
isLoading$ = new BehaviorSubject(false);
data$ = new BehaviorSubject<Data[]>([]);
error$ = new BehaviorSubject<string | null>(null);

// What if isLoading is true but data has stale values?
// Need complex combineLatest/switchMap logic
```

**Decision**:
Use **Angular signals** for component-local state management. Reserve **RxJS** for complex asynchronous operations involving multiple streams, time-based operations, or HTTP requests.

**What Are Signals?**

Signals are Angular's new reactivity primitive that automatically track dependencies and notify consumers when values change:

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubled() }}</p>
    <button (click)="increment()">+1</button>
  `
})
export class CounterComponent {
  // Writable signal
  public count = signal(0);

  // Computed signal (derived state)
  public doubled = computed(() => this.count() * 2);

  // Effect (side effect when signal changes)
  public constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  public increment(): void {
    this.count.update(value => value + 1);
  }
}
```

**When to Use Signals vs RxJS:**

### Use Signals For:

#### 1. Component-Local State
```typescript
// ✅ Signals for simple component state
@Component({
  template: `
    <div *ngIf="loading()">Loading...</div>
    <div *ngIf="user()">{{ user()?.name }}</div>
    <button (click)="toggleTheme()">
      Theme: {{ theme() }}
    </button>
  `
})
export class UserProfileComponent {
  public loading = signal(false);
  public user = signal<User | null>(null);
  public theme = signal<'light' | 'dark'>('light');

  public toggleTheme(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }
}
```

#### 2. Derived/Computed State
```typescript
// ✅ Computed signals for derived values
@Component({
  template: `
    <p>Total: {{ total() }}</p>
    <p>Tax: {{ tax() }}</p>
    <p>Grand Total: {{ grandTotal() }}</p>
  `
})
export class CartComponent {
  public items = signal<CartItem[]>([]);
  public taxRate = signal(0.1);

  // Computed signals automatically update
  public total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  public tax = computed(() => this.total() * this.taxRate());

  public grandTotal = computed(() => this.total() + this.tax());

  // Update items → all computed values automatically recalculate
  public addItem(item: CartItem): void {
    this.items.update(items => [...items, item]);
  }
}
```

#### 3. Form State
```typescript
// ✅ Signals for form state
@Component({
  template: `
    <form>
      <input [value]="username()" (input)="updateUsername($event)" />
      <input [value]="email()" (input)="updateEmail($event)" />

      <p *ngIf="!isValid()">Form is invalid</p>
      <button [disabled]="!isValid()">Submit</button>
    </form>
  `
})
export class SignupFormComponent {
  public username = signal('');
  public email = signal('');

  public isValid = computed(() =>
    this.username().length >= 3 && this.email().includes('@')
  );

  public updateUsername(event: Event): void {
    this.username.set((event.target as HTMLInputElement).value);
  }

  public updateEmail(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }
}
```

### Use RxJS For:

#### 1. HTTP Requests
```typescript
// ✅ RxJS for HTTP (async operations)
@Component({
  template: `
    <div *ngIf="loading()">Loading...</div>
    <div *ngFor="let comic of comics()">{{ comic.title }}</div>
  `
})
export class ComicListComponent {
  public comics = signal<Comic[]>([]);
  public loading = signal(false);

  private readonly httpClient = inject(HttpClient);

  public ngOnInit(): void {
    this.loading.set(true);

    // RxJS for HTTP request
    this.httpClient.get<Comic[]>('/api/comics')
      .subscribe({
        next: data => {
          this.comics.set(data);  // Update signal with result
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
```

#### 2. Multiple Stream Coordination
```typescript
// ✅ RxJS for combining multiple async streams
@Component({
  template: `
    <div>User: {{ userName() }}</div>
    <div>Comics: {{ comicCount() }}</div>
  `
})
export class DashboardComponent {
  public userName = signal('');
  public comicCount = signal(0);

  private readonly user$ = this.userService.currentUser$;
  private readonly comics$ = this.comicsService.comics$;

  public ngOnInit(): void {
    // Combine multiple observables
    combineLatest([this.user$, this.comics$])
      .subscribe(([user, comics]) => {
        this.userName.set(user.name);      // Update signals
        this.comicCount.set(comics.length);
      });
  }
}
```

#### 3. Time-Based Operations
```typescript
// ✅ RxJS for debouncing, throttling, intervals
@Component({
  template: `
    <input [value]="searchTerm()" (input)="onSearch($event)" />
    <div *ngFor="let result of searchResults()">{{ result }}</div>
  `
})
export class SearchComponent {
  public searchTerm = signal('');
  public searchResults = signal<string[]>([]);

  private searchSubject = new Subject<string>();

  public ngOnInit(): void {
    // RxJS for debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchService.search(term))
    ).subscribe(results => {
      this.searchResults.set(results);  // Update signal
    });
  }

  public onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.searchSubject.next(term);  // Emit to RxJS stream
  }
}
```

**Signal API:**

### Creating Signals
```typescript
// Writable signal with initial value
const count = signal(0);
const user = signal<User | null>(null);
const items = signal<Item[]>([]);

// Read signal value (call as function)
console.log(count());  // 0

// Update signal value
count.set(10);                          // Set new value
count.update(current => current + 1);   // Update based on current
```

### Computed Signals
```typescript
// Computed signal (read-only, derived from other signals)
const count = signal(0);
const doubled = computed(() => count() * 2);

console.log(doubled());  // 0
count.set(5);
console.log(doubled());  // 10 (automatically updated)

// Computed with multiple dependencies
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);
```

### Effects
```typescript
// Effect runs when signal dependencies change
const count = signal(0);

effect(() => {
  console.log('Count:', count());
  // Automatically re-runs when count() changes
});

count.set(1);  // Logs: "Count: 1"
count.set(2);  // Logs: "Count: 2"

// Effect cleanup
effect((onCleanup) => {
  const timer = setInterval(() => console.log(count()), 1000);

  onCleanup(() => clearInterval(timer));
});
```

**Signal Patterns:**

### 1. Loading State Pattern
```typescript
@Component({
  template: `
    <div *ngIf="state() === 'loading'">Loading...</div>
    <div *ngIf="state() === 'error'">{{ error() }}</div>
    <div *ngIf="state() === 'success'">
      <div *ngFor="let comic of comics()">{{ comic.title }}</div>
    </div>
  `
})
export class ComicListComponent {
  public state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  public comics = signal<Comic[]>([]);
  public error = signal<string | null>(null);

  public async loadComics(): Promise<void> {
    this.state.set('loading');

    try {
      const data = await fetch('/api/comics').then(r => r.json());
      this.comics.set(data);
      this.state.set('success');
    } catch (err) {
      this.error.set(err.message);
      this.state.set('error');
    }
  }
}
```

### 2. Pagination Pattern
```typescript
@Component({
  template: `
    <div *ngFor="let item of paginatedItems()">{{ item }}</div>

    <button (click)="previousPage()" [disabled]="!hasPrevious()">
      Previous
    </button>
    <span>Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
    <button (click)="nextPage()" [disabled]="!hasNext()">
      Next
    </button>
  `
})
export class PaginatedListComponent {
  public allItems = signal<Item[]>([]);
  public currentPage = signal(0);
  public pageSize = signal(10);

  // Computed signals for pagination
  public totalPages = computed(() =>
    Math.ceil(this.allItems().length / this.pageSize())
  );

  public paginatedItems = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return this.allItems().slice(start, end);
  });

  public hasPrevious = computed(() => this.currentPage() > 0);
  public hasNext = computed(() => this.currentPage() < this.totalPages() - 1);

  public nextPage(): void {
    this.currentPage.update(page => page + 1);
  }

  public previousPage(): void {
    this.currentPage.update(page => page - 1);
  }
}
```

### 3. Selection Pattern
```typescript
@Component({
  template: `
    <div *ngFor="let item of items()">
      <label>
        <input type="checkbox"
               [checked]="isSelected(item.id)"
               (change)="toggleSelection(item.id)">
        {{ item.name }}
      </label>
    </div>

    <p>Selected: {{ selectedCount() }} / {{ items().length }}</p>
    <button (click)="selectAll()">Select All</button>
    <button (click)="clearSelection()">Clear</button>
  `
})
export class SelectableListComponent {
  public items = signal<Item[]>([]);
  public selectedIds = signal<Set<string>>(new Set());

  public selectedCount = computed(() => this.selectedIds().size);

  public allSelected = computed(() =>
    this.selectedIds().size === this.items().length
  );

  public isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  public toggleSelection(id: string): void {
    this.selectedIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  }

  public selectAll(): void {
    this.selectedIds.set(new Set(this.items().map(item => item.id)));
  }

  public clearSelection(): void {
    this.selectedIds.set(new Set());
  }
}
```

### 4. toSignal / toObservable Interop
```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

@Component({})
export class InteropComponent {
  // Convert Observable to Signal
  private readonly user$ = this.userService.currentUser$;
  public user = toSignal(this.user$, { initialValue: null });

  // Use in template without async pipe
  // {{ user()?.name }}

  // Convert Signal to Observable
  public searchTerm = signal('');
  public searchTerm$ = toObservable(this.searchTerm);

  public results$ = this.searchTerm$.pipe(
    debounceTime(300),
    switchMap(term => this.searchService.search(term))
  );
}
```

**Performance Benefits:**

### 1. Zoneless Change Detection
```typescript
// ✅ With signals, Angular knows exactly what changed
@Component({
  template: `
    <p>Count: {{ count() }}</p>
    <p>Other: {{ otherValue }}</p>
  `
})
export class OptimizedComponent {
  public count = signal(0);
  public otherValue = 'static';

  public increment(): void {
    this.count.update(c => c + 1);
    // Only updates {{ count() }} in template, not the whole component
  }
}
```

### 2. Fine-Grained Reactivity
```typescript
// ✅ Computed signals only re-calculate when dependencies change
const firstName = signal('John');
const lastName = signal('Doe');
const age = signal(30);

const fullName = computed(() => `${firstName()} ${lastName()}`);
// Only recalculates when firstName or lastName changes, not when age changes

const displayAge = computed(() => `Age: ${age()}`);
// Only recalculates when age changes
```

**Migration from RxJS:**

```typescript
// ❌ Before (RxJS for simple state)
export class UserComponent {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  public displayName$ = this.user$.pipe(
    map(user => user ? `${user.firstName} ${user.lastName}` : 'Guest')
  );

  public setUser(user: User): void {
    this.userSubject.next(user);
  }
}

// Template
<div>{{ displayName$ | async }}</div>

// ✅ After (Signals)
export class UserComponent {
  public user = signal<User | null>(null);

  public displayName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Guest';
  });

  public setUser(user: User): void {
    this.user.set(user);
  }
}

// Template (no async pipe!)
<div>{{ displayName() }}</div>
```

**Best Practices:**

1. **Use signals for synchronous state**
```typescript
// ✅
public loading = signal(false);
public user = signal<User | null>(null);

// ❌
public loading$ = new BehaviorSubject(false);
```

2. **Use computed for derived state**
```typescript
// ✅
public total = computed(() => this.items().reduce(...));

// ❌
public updateItems(items: Item[]): void {
  this.items.set(items);
  this.total.set(items.reduce(...));  // Don't do this!
}
```

3. **Don't overuse effects**
```typescript
// ❌ Effect for simple computation
effect(() => {
  this.doubled.set(this.count() * 2);
});

// ✅ Use computed instead
public doubled = computed(() => this.count() * 2);
```

4. **Combine signals and RxJS appropriately**
```typescript
// ✅ RxJS for HTTP, signals for state
public ngOnInit(): void {
  this.http.get<Data>('/api/data').subscribe(
    data => this.data.set(data)  // Update signal
  );
}
```

**Rationale**:
- ⚡ **Better performance**: Zoneless change detection, fine-grained reactivity
- 🎯 **Simpler mental model**: No subscriptions, no memory leaks, no async pipes
- 🔄 **Native integration**: Built into Angular core, first-class support
- 📊 **Automatic updates**: Computed signals and templates update automatically
- 🌐 **Interop with RxJS**: toSignal/toObservable for seamless integration
- 🧪 **Easier testing**: No async complexity for simple state
- 🏗️ **Architecture-friendly**: Local state stays local, clear component boundaries
- 🚀 **Future-proof**: Angular's direction is signals-first

**Consequences**:
- ✅ Cleaner component code (no BehaviorSubject boilerplate)
- ✅ Better performance in zoneless mode (fine-grained updates)
- ✅ No memory leaks from forgotten unsubscribe
- ✅ No async pipe in templates (direct signal access)
- ✅ Automatic change detection (framework knows dependencies)
- ✅ Easier to reason about (synchronous by default)
- ✅ Aligns with Angular's future direction
- ⚠️ Team needs to learn signals API (minor learning curve)
- ⚠️ Need to know when to use signals vs RxJS
- ⚠️ Some third-party libraries still use RxJS (interop works)

**Alternatives Considered**:

1. **RxJS for Everything**
   - ❌ Rejected: Over-engineered for simple component state
   - ❌ Memory leak risk, async complexity, verbose

2. **Plain Properties + Manual Change Detection**
   - ❌ Rejected: No reactivity, must call markForCheck manually
   - ❌ Error-prone, easy to forget

3. **State Management Library (NgRx, Akita)**
   - ⚠️ Not mutually exclusive - use for global state
   - ✅ Signals are for component-local state
   - ✅ Can combine: NgRx + signals (future direction)

**Related ADRs**:
- [ADR-011: Standalone Components](./011-standalone-components.md) - Signals work seamlessly with standalone
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Signals only in presentation layer
- [ADR-009: Vitest over Jest](./009-vitest-over-jest.md) - Testing signals is simpler than observables

---

**Last Updated**: January 18, 2026
