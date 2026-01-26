# ADR-012: Standalone Components

**Status**: ✅ Accepted

**Context**:
Angular evolved from a module-based architecture (NgModules) to support standalone components starting in Angular 14, with standalone becoming the recommended default in Angular 15+. Angular 21 fully embraces standalone as the primary development approach.

**Problems with NgModules:**

1. **Boilerplate overhead**:
```typescript
// ❌ NgModule approach - lots of boilerplate
@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    // ... 20 more components
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    // ... 15 more modules
  ],
  exports: [
    LoginComponent,
    SignupComponent,
    // Need to remember to export!
  ]
})
export class AuthModule {}

// Then use it
@Component({
  template: '<app-login></app-login>'
})
export class SomeComponent {}  // Needs to be in a module that imports AuthModule
```

2. **Unclear dependencies**:
```typescript
// ❌ Where does MatButtonModule come from?
@Component({
  template: '<button mat-button>Click</button>'
})
export class MyComponent {}
// Works if ANY parent module imports MatButtonModule
// Not clear from looking at the component alone
```

3. **Circular dependencies**:
```typescript
// ❌ Module A imports Module B, Module B imports Module A
@NgModule({
  imports: [BModule],
  exports: [AComponent]
})
export class AModule {}

@NgModule({
  imports: [AModule],
  exports: [BComponent]
})
export class BModule {}
// Causes runtime errors, hard to debug
```

4. **Poor tree-shaking**:
```typescript
// ❌ NgModule imports pull in everything
@NgModule({
  imports: [MaterialModule]  // Imports ALL Material components
})
// Even if you only use MatButton, all components are bundled
```

5. **Compilation performance**:
```typescript
// ❌ NgModules create long compilation chains
// Module hierarchy creates dependencies
// Change one module → recompile dependent modules
```

**Decision**:
Use **standalone components** exclusively. Zero NgModules in the application code (except for third-party libraries that still require them).

**What Are Standalone Components?**

Standalone components are self-contained units that explicitly declare their dependencies:

```typescript
// ✅ Standalone component - clear and explicit
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,  // 👈 Key property
  imports: [         // 👈 Explicit imports
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ],
  template: `
    <form [formGroup]="loginForm">
      <mat-form-field>
        <input matInput formControlName="username" placeholder="Username">
      </mat-form-field>
      <button mat-button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  // Component logic
}
```

**Benefits:**

### 1. Explicit Dependencies
```typescript
// ✅ You know exactly what this component uses
@Component({
  standalone: true,
  imports: [
    CommonModule,      // *ngIf, *ngFor, pipes
    MatCardModule,     // <mat-card>
    MatButtonModule    // mat-button
  ],
  template: `
    <mat-card *ngIf="visible">
      <button mat-button>Click</button>
    </mat-card>
  `
})
export class ComicCardComponent {}

// Look at imports → know what's available in template
// No hidden dependencies from parent modules
```

### 2. Better Tree-Shaking
```typescript
// ✅ Only imports what you need
@Component({
  standalone: true,
  imports: [
    MatButtonModule,   // Only MatButton code is bundled
    MatCardModule      // Only MatCard code is bundled
  ]
})
// Unused Material components are tree-shaken away
// Smaller bundle size
```

### 3. Simpler Testing
```typescript
// ✅ Test standalone component - no module configuration
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]  // Just import the component!
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// ❌ NgModule testing - complex setup
beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [LoginComponent],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      // ... all the dependencies
    ]
  });
});
```

### 4. Component Reusability
```typescript
// ✅ Use standalone component anywhere - just import it
@Component({
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent  // Import component directly, no module needed
  ],
  template: `
    <div>
      <app-login></app-login>
    </div>
  `
})
export class AuthPageComponent {}

// No need for shared modules or careful module imports
```

### 5. Lazy Loading Simplified
```typescript
// ✅ Lazy load individual components, not modules
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'comics',
    loadChildren: () =>
      import('./comics/comics.routes').then(m => m.COMICS_ROUTES)
  }
];

// ❌ Old NgModule lazy loading
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  // Requires creating a module just for lazy loading
}
```

**Application Bootstrap:**

```typescript
// main.ts - Bootstrap with standalone component
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/shell/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

// app.config.ts - Application configuration
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    // ... other providers
  ]
};

// app.component.ts - Root standalone component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent {}
```

**Routing with Standalone:**

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'comics',
    loadChildren: () =>
      import('./comics/comics.routes').then(m => m.COMICS_ROUTES)
  }
];

// comics/comics.routes.ts
import { Routes } from '@angular/router';

export const COMICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./comic-list.component').then(m => m.ComicListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./comic-detail.component').then(m => m.ComicDetailComponent)
  }
];
```

**Shared Functionality:**

Instead of shared modules, create shared standalone components:

```typescript
// shared/ui/loading-spinner.component.ts
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: '<mat-spinner></mat-spinner>'
})
export class LoadingSpinnerComponent {}

// Use it anywhere - just import the component
@Component({
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: '<app-loading-spinner *ngIf="loading" />'
})
export class SomeComponent {}
```

**Providers in Standalone:**

```typescript
// ✅ Provide services in standalone component
@Component({
  standalone: true,
  providers: [ComicService],  // Scoped to this component tree
  template: '...'
})
export class ComicListComponent {}

// ✅ Or use providedIn for singleton services
@Injectable({
  providedIn: 'root'  // Singleton across app
})
export class AuthService {}

// ✅ Or provide in route
{
  path: 'admin',
  loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
  providers: [AdminService]  // Scoped to this route
}
```

**Interop with NgModules:**

```typescript
// ✅ Standalone component can import NgModule
import { MaterialModule } from './material.module';

@Component({
  standalone: true,
  imports: [MaterialModule],  // Can still import modules if needed
  template: '...'
})
export class MyComponent {}

// ✅ NgModule can use standalone component
@NgModule({
  imports: [
    MyStandaloneComponent  // Import standalone component in module
  ]
})
export class LegacyModule {}
```

**Migration from NgModules:**

If migrating existing code:

```bash
# Angular CLI migration schematic
ng generate @angular/core:standalone
```

This automatically:
1. Adds `standalone: true` to components
2. Moves module imports to component imports
3. Updates routing configuration
4. Removes unused modules

**Common Patterns:**

### 1. Barrel Files for Component Groups
```typescript
// comics/index.ts
export { ComicListComponent } from './comic-list.component';
export { ComicCardComponent } from './comic-card.component';
export { ComicDetailComponent } from './comic-detail.component';

// Usage
import { ComicListComponent, ComicCardComponent } from './comics';
```

### 2. Utility Functions for Common Imports
```typescript
// shared/utils/common-imports.ts
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

export const COMMON_IMPORTS = [
  CommonModule,
  ReactiveFormsModule
] as const;

// Usage
@Component({
  standalone: true,
  imports: [...COMMON_IMPORTS, MatButtonModule],
  template: '...'
})
export class MyComponent {}
```

### 3. Feature Routes with Guards
```typescript
// comics/comics.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

export const COMICS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],  // Functional guard
    loadComponent: () =>
      import('./comic-list.component').then(m => m.ComicListComponent)
  }
];
```

**Layered Architecture Integration:**

Standalone components fit perfectly with our layered architecture:

```typescript
// ✅ Presentation layer - standalone components with Material
@Component({
  selector: 'app-comic-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule
  ],
  template: '...'
})
export class ComicListComponent {
  // Injects use case from Application layer
  private readonly getComicsUseCase = inject(GetComicsUseCase);

  protected readonly comics = signal<Comic[]>([]);

  public ngOnInit(): void {
    this.getComicsUseCase.execute().then(result => {
      this.comics.set(result);
    });
  }
}

// ✅ No Angular dependencies in Application/Domain/Infrastructure layers
// Only Presentation layer has Angular-specific code (standalone components)
```

**Rationale**:
- 🎯 **Future-proof**: Aligns with Angular's direction (default since v15)
- 📦 **Simpler**: No module boilerplate, clearer dependencies
- 🌲 **Better tree-shaking**: Imports only what's needed, smaller bundles
- ⚡ **Faster compilation**: No module dependency chains
- 🧩 **Explicit imports**: See exactly what each component uses
- 🧪 **Easier testing**: No module configuration in tests
- ♻️ **Reusable**: Use components anywhere without module setup
- 🚀 **Better lazy loading**: Load individual components, not modules
- 🏗️ **Architecture-friendly**: Matches our layered architecture (presentation layer isolated)

**Consequences**:
- ✅ Future-proof architecture (Angular's recommended approach)
- ✅ Reduced boilerplate (no module declarations/exports)
- ✅ Clearer component dependencies (explicit imports)
- ✅ Smaller bundle sizes (better tree-shaking)
- ✅ Faster compilation (no module chains)
- ✅ Simpler testing (no module configuration)
- ✅ Better code locality (dependencies visible in component)
- ✅ Easier refactoring (move component = move file)
- ⚠️ More imports per component (but explicit is better than implicit)
- ⚠️ Team needs to learn new patterns (minor learning curve)
- ⚠️ Some third-party libraries still use NgModules (interop works)

**Alternatives Considered**:

1. **NgModules (traditional approach)**
   - ❌ Rejected: Legacy approach, Angular is moving away
   - ❌ More boilerplate, less explicit dependencies
   - ❌ Harder to tree-shake, slower compilation

2. **Hybrid (mix NgModules and Standalone)**
   - ❌ Rejected: Adds complexity, two patterns to maintain
   - ❌ Not future-proof, will need migration later
   - ⚠️ Only acceptable for gradual migration

3. **Feature Modules + Standalone**
   - ❌ Rejected: Still has module complexity
   - ❌ Why have modules if standalone works well?

**Best Practices**:

1. **Always set `standalone: true`** on new components
2. **Import components/modules explicitly** in each component
3. **Use barrel exports** for component groups
4. **Lazy load** routes with `loadComponent` and `loadChildren`
5. **Test components** by importing them directly in TestBed
6. **Provide services** via `providedIn: 'root'` or route providers
7. **Keep presentation layer isolated** - only place with Angular code

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Standalone components stay in presentation layer
- [ADR-014: Angular Material](./014-angular-material-for-ui-components.md) - Material modules work seamlessly with standalone
- [ADR-013: Signals for State Management](./013-signals-for-state-management.md) - Modern Angular patterns with standalone

---

**Last Updated**: January 18, 2026
