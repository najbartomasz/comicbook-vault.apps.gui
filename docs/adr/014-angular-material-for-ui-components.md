# ADR-014: Angular Material for UI Components

**Status**: ✅ Accepted

**Context**:
The presentation layer requires a comprehensive, accessible UI component library that integrates seamlessly with Angular's standalone components and provides a consistent design system.

**Why We Need a UI Component Library:**

Building UI components from scratch is costly:

1. **Development time**: Custom components take 10-20x longer to build
   - Buttons, inputs, dialogs, tables, etc. need months of work
   - Each component needs states: disabled, loading, error, etc.

2. **Accessibility**: WCAG compliance is complex
   - Keyboard navigation, ARIA labels, screen reader support
   - Focus management, color contrast, semantic HTML
   - Easy to miss edge cases without dedicated testing

3. **Cross-browser consistency**: Different browsers need different fixes
   - Safari, Chrome, Firefox all have quirks
   - Mobile browsers add more complexity

4. **Maintenance burden**: Custom components require ongoing work
   - Bug fixes, new features, security updates
   - Documentation, examples, tests

5. **Design inconsistency**: Without a system, UI becomes fragmented
   - Buttons look different across pages
   - Spacing, colors, typography vary

**Decision**:
Use **Angular Material** as the primary UI component library for all presentation layer components.

**Why Angular Material?**

### 1. Official Angular Integration
```typescript
// ✅ Standalone component with Material
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-comic-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ comic.title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        {{ comic.description }}
      </mat-card-content>
      <mat-card-actions>
        <button mat-button>Read</button>
        <button mat-raised-button color="primary">Buy</button>
      </mat-card-actions>
    </mat-card>
  `
})
export class ComicCardComponent {}
```

### 2. Built-in Accessibility
```typescript
// ✅ Accessibility handled automatically
import { MatDialogModule } from '@angular/material/dialog';

// Dialog has:
// - Keyboard navigation (Esc to close, Tab to navigate)
// - ARIA labels (role="dialog", aria-labelledby, aria-describedby)
// - Focus trapping (focus stays within dialog)
// - Screen reader announcements
// - Color contrast compliance

@Component({
  template: `
    <h2 mat-dialog-title>Delete Comic</h2>
    <mat-dialog-content>
      Are you sure you want to delete this comic?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Delete
      </button>
    </mat-dialog-actions>
  `
})
export class DeleteComicDialogComponent {}
```

### 3. Comprehensive Component Set
Available components:

**Form Controls:**
- Buttons (mat-button, mat-raised-button, mat-icon-button, mat-fab)
- Input fields (mat-input, mat-select, mat-checkbox, mat-radio)
- Date pickers (mat-datepicker)
- Sliders, toggles, autocomplete

**Navigation:**
- Toolbar, sidenav, menu, tabs
- Stepper (multi-step forms)

**Layout:**
- Cards, expansion panels, grid list
- Divider, list

**Popups & Modals:**
- Dialog, bottom sheet, snackbar (toasts)
- Tooltip

**Data Display:**
- Table (mat-table with sorting, pagination, filtering)
- Paginator, sort header
- Chips, badges

**Indicators:**
- Progress bar, spinner
- Icon (mat-icon with Material Icons)

### 4. Powerful Theming System
```scss
// styles.scss - Custom theme
@use '@angular/material' as mat;

// Define custom palette
$custom-primary: mat.define-palette(mat.$indigo-palette);
$custom-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$custom-warn: mat.define-palette(mat.$red-palette);

// Create theme
$custom-theme: mat.define-light-theme((
  color: (
    primary: $custom-primary,
    accent: $custom-accent,
    warn: $custom-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

// Include theme
@include mat.all-component-themes($custom-theme);

// Dark mode support
.dark-theme {
  $dark-theme: mat.define-dark-theme((
    color: (
      primary: $custom-primary,
      accent: $custom-accent,
      warn: $custom-warn,
    )
  ));

  @include mat.all-component-colors($dark-theme);
}
```

### 5. Typography Customization
```scss
// Custom typography
$custom-typography: mat.define-typography-config(
  $font-family: 'Roboto, sans-serif',
  $headline-1: mat.define-typography-level(112px, 112px, 300),
  $headline-2: mat.define-typography-level(56px, 56px, 400),
  $headline-3: mat.define-typography-level(45px, 48px, 400),
  $headline-4: mat.define-typography-level(34px, 40px, 400),
  $headline-5: mat.define-typography-level(24px, 32px, 400),
  $headline-6: mat.define-typography-level(20px, 32px, 500),
  $subtitle-1: mat.define-typography-level(16px, 28px, 400),
  $subtitle-2: mat.define-typography-level(14px, 24px, 500),
  $body-1: mat.define-typography-level(16px, 24px, 400),
  $body-2: mat.define-typography-level(14px, 20px, 400),
  $caption: mat.define-typography-level(12px, 20px, 400),
  $button: mat.define-typography-level(14px, 14px, 500),
);

@include mat.all-component-typographies($custom-typography);
```

### 6. Tree-Shakable (Optimized Bundle)
```typescript
// ❌ imports entire library
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

// ✅ imports only what you need
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// Only MatButton and MatCard code is included in bundle
// Unused components are tree-shaken away
```

**Implementation in Layered Architecture:**

Material components are **presentation layer only**:

```
src/
  app/
    comics/
      domain/
        comic.interface.ts           ← Pure TypeScript, no Material
      application/
        get-comics.use-case.ts       ← Pure TypeScript, no Material
      infrastructure/
        comics-api.adapter.ts        ← Pure TypeScript, no Material
      presentation/
        comic-list.component.ts      ← ✅ Material components here
        comic-card.component.ts      ← ✅ Material components here
        comic-dialog.component.ts    ← ✅ Material components here
```

**Why this matters:**
- ✅ Business logic (Domain, Application) remains framework-agnostic
- ✅ Can test business logic without Material dependencies
- ✅ Could swap Material for another UI library without changing business logic
- ✅ Presentation layer is the only place with Material imports

**Common Patterns:**

### 1. Forms with Material
```typescript
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" required>
        <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
          Username is required
        </mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" required>
        <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
          Password is required
        </mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit"
              [disabled]="loginForm.invalid">
        Login
      </button>
    </form>
  `
})
export class LoginFormComponent {
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  public constructor(private readonly fb: FormBuilder) {}

  public onSubmit(): void {
    if (this.loginForm.valid) {
      // Call use case (application layer)
      const { username, password } = this.loginForm.value;
    }
  }
}
```

### 2. Data Tables
```typescript
import { Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-comics-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  template: `
    <table mat-table [dataSource]="comics()" matSort>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
        <td mat-cell *matCellDef="let comic">{{ comic.title }}</td>
      </ng-container>

      <ng-container matColumnDef="author">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Author</th>
        <td mat-cell *matCellDef="let comic">{{ comic.author }}</td>
      </ng-container>

      <ng-container matColumnDef="year">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Year</th>
        <td mat-cell *matCellDef="let comic">{{ comic.year }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons>
    </mat-paginator>
  `
})
export class ComicsTableComponent {
  public comics = signal<Comic[]>([]);
  public displayedColumns = ['title', 'author', 'year'];
}
```

### 3. Dialogs
```typescript
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Deletion</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this comic?</p>
      <p>This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Delete
      </button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirmationDialogComponent {}

// Usage in another component
@Component({
  // ...
})
export class ComicListComponent {
  private readonly dialog = inject(MatDialog);

  public deleteComic(comic: Comic): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // Call delete use case
      }
    });
  }
}
```

### 4. Snackbars (Toast Notifications)
```typescript
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  // ...
})
export class ComicFormComponent {
  private readonly snackBar = inject(MatSnackBar);

  public saveComic(): void {
    // Call use case
    this.saveComicUseCase.execute(comic).then(() => {
      this.snackBar.open('Comic saved successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  }
}
```

**Installation & Setup:**

```bash
# Install Angular Material
ng add @angular/material

# Select theme, typography, animations
```

**Configuration:**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // Required for Material animations
    // ... other providers
  ]
};
```

**Bundle Size Optimization:**

```typescript
// ✅ Import only what you need per component
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// ❌ Don't create a "MaterialModule" that imports everything
// This prevents tree-shaking

// ✅ each component imports its own Material modules
@Component({
  imports: [MatButtonModule, MatCardModule]
})
```

**Rationale**:
- 🎨 **Official**: Built and maintained by Angular team, guaranteed compatibility
- ♿ **Accessible**: WCAG 2.1 Level AA compliant out-of-the-box
- 🎯 **Design System**: Material Design provides consistent, professional aesthetic
- 📱 **Responsive**: Mobile-first components work on all screen sizes
- 🔧 **Modern**: Works with Angular 21+ standalone components and signals
- 🌙 **Themable**: Comprehensive theming system for customization
- 📦 **Tree-shakable**: Optimized bundle size (only import what you use)
- 🧪 **Well-tested**: Extensive test coverage and real-world usage
- 📚 **Documented**: Comprehensive docs with interactive examples
- 🔄 **Updated**: Regular releases aligned with Angular versions
- 🏗️ **Architecture-friendly**: Stays in presentation layer only

**Consequences**:
- ✅ Consistent, professional UI without custom CSS development
- ✅ Accessibility (keyboard nav, ARIA, screen readers) handled automatically
- ✅ Regular updates aligned with Angular releases
- ✅ Extensive documentation and large community support
- ✅ Faster development (no need to build common components)
- ✅ Mobile responsive out-of-the-box
- ✅ Dark mode support built-in
- ✅ Only ~300KB gzipped for commonly used components (tree-shaken)
- ⚠️ Opinionated design (Material Design aesthetic, not everyone's preference)
- ⚠️ Bundle size consideration (though optimized with tree-shaking)
- ⚠️ Limited to Angular ecosystem (tied to presentation layer, not portable)
- ⚠️ Theming requires SCSS knowledge for deep customization
- ⚠️ Breaking changes possible between major Angular versions

**Alternatives Considered**:

1. **PrimeNG**
   - ❌ Rejected: More components (170+) but heavier bundle size
   - ❌ Not as tightly integrated with Angular
   - ❌ Less accessible by default

2. **NG-ZORRO (Ant Design)**
   - ❌ Rejected: Good library but less Angular-native
   - ❌ Ant Design aesthetic may not fit all projects
   - ❌ Smaller community than Material

3. **NgBootstrap (Bootstrap)**
   - ❌ Rejected: Based on Bootstrap (jQuery roots)
   - ❌ Less modern, not as accessible
   - ❌ Not built specifically for Angular

4. **Custom Component Library**
   - ❌ Rejected: Full control but high development and maintenance cost
   - ❌ Would take 6-12 months to build comparable component set
   - ❌ Accessibility requires specialized expertise
   - ❌ Bug fixes and updates are our responsibility

5. **Headless UI + Custom Styling**
   - ❌ Rejected: Good for design flexibility, but more work
   - ❌ Still need to build accessibility features
   - ❌ More development time than Material

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Material stays in presentation layer only
- [ADR-011: Standalone Components](./011-standalone-components.md) - Material modules work with standalone components
- [ADR-010: Playwright for E2E](./010-playwright-for-e2e.md) - Testing Material components in real browsers

---

**Last Updated**: January 18, 2026
