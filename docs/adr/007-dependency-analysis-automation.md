# ADR-007: Dependency Analysis Automation

**Status**: ✅ Accepted

**Context**:
Manual architecture validation is error-prone and catches violations too late in the development cycle. Without automated enforcement:

**Real-world problems:**
1. **Circular dependencies** creep in unnoticed, breaking module boundaries
   - Example: `domain/` imports from `application/`, which imports from `domain/`
2. **Layer violations** bypass architecture rules (inner layers depending on outer layers)
   - Example: `domain/user.ts` importing from `infrastructure/fetch-client.ts`
3. **Orphaned files** accumulate (imports removed but file remains)
   - Example: Old `user-validator.ts` still exists but nothing imports it
4. **Architecture drift** happens gradually as team grows
   - Example: New developers unaware of layer boundaries add violations
5. **Late detection** means violations discovered in code review, wasting time
   - Example: PR rejected after hours of work due to architecture violation

**Decision**:
Implement automated dependency analysis using **Dependency Cruiser** with:
- Pre-commit validation of layer boundaries
- Automated detection of circular dependencies
- Visual dependency graphs (SVG) generated on demand
- CI/CD pipeline integration to block violations

**Tools Used**:

### 1. Dependency Cruiser
**Purpose**: Validate architecture rules and detect violations

**Configuration** (`.dependency-cruiser.js`):
```javascript
module.exports = {
  forbidden: [
    // Domain layer cannot depend on any other layer
    {
      name: 'domain-layer-isolation',
      from: { path: '**/domain/**' },
      to: { pathNot: '**/domain/**' },
      comment: 'Domain layer must not depend on other layers'
    },
    // Application layer can only depend on Domain
    {
      name: 'application-depends-domain-only',
      from: { path: '**/application/**' },
      to: {
        pathNot: ['**/application/**', '**/domain/**']
      },
      comment: 'Application layer can only depend on Domain'
    },
    // Infrastructure layer can only depend on Domain
    {
      name: 'infrastructure-depends-domain-only',
      from: { path: '**/infrastructure/**' },
      to: {
        pathNot: ['**/infrastructure/**', '**/domain/**']
      },
      comment: 'Infrastructure implements Domain interfaces only'
    },
    // DI layer can depend on Domain + Infrastructure
    {
      name: 'di-depends-domain-infrastructure',
      from: { path: '**/di/**' },
      to: {
        pathNot: ['**/di/**', '**/domain/**', '**/infrastructure/**']
      },
      comment: 'DI layer wires Domain and Infrastructure'
    },
    // No circular dependencies
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
      comment: 'Circular dependencies are not allowed'
    },
    // No orphaned files (not imported by anything)
    {
      name: 'no-orphans',
      severity: 'warn',
      from: { orphan: true, pathNot: ['**/*.spec.ts', '**/index.ts'] },
      to: {},
      comment: 'Orphaned files should be removed'
    }
  ]
};
```

### 2. ESLint Boundaries Plugin
**Purpose**: Enforce boundaries within code editor (real-time feedback)

**Example Violation Detection**:
```typescript
// ❌ domain/user.ts
import { FetchHttpClient } from '../infrastructure/fetch-client';
//                                    ^
// ESLint error: domain/ cannot import from infrastructure/

// ✅ domain/user.ts (correct)
import { HttpClient } from './http-client.interface';
```

**Developer Workflow**:

1. **During Development** (Real-time):
   - ESLint shows red squiggles for violations
   - VS Code problems panel lists architecture errors
   - Fix before committing

2. **Pre-Commit Hook** (via Husky):
   ```bash
   npm run check:dependencies
   ```
   - Blocks commit if violations found
   - Fast feedback (< 2 seconds)
   - Shows exact violation with file/line number

3. **CI/CD Pipeline**:
   ```yaml
   - name: Validate Architecture
     run: npm run check:dependencies
   ```
   - Final safeguard before merge
   - Generates violation report
   - Blocks PR if any violations

**Example Violation Output**:
```
❌ Dependency rule violated:

  domain-layer-isolation: Domain layer must not depend on other layers

  src/app/auth/domain/authenticator.ts:3:1
    → src/app/auth/infrastructure/http-client.ts

  Fix: Move import to Application layer or use Domain interface
```

**Visual Dependency Graphs**:

Generate architecture visualization:
```bash
npm run dependency-graph
```

Outputs:
- `docs/architecture/dependencies.svg` - Full project graph
- `docs/architecture/circular.svg` - Circular dependency detection
- `docs/architecture/layers.svg` - Layer dependency diagram

**Metrics Tracking**:

Automated metrics (updated in pre-commit):
- Total files per layer
- Dependency count between layers
- Circular dependency count (must be 0)
- Orphaned files count
- Architecture health score

**Rationale**:
- 🚀 **Early detection**: Violations caught during development, not in PR
- 🔒 **Enforcement**: Impossible to commit violations (pre-commit hooks)
- 📊 **Visibility**: Visual graphs show architecture evolution over time
- 🧪 **CI/CD safety**: Automated validation in pipeline prevents merging violations
- 📚 **Documentation**: Generated graphs serve as living architecture documentation
- 🎯 **Team alignment**: Same rules enforced for all developers automatically

**Consequences**:
- ✅ Architecture violations caught in < 2 seconds during development
- ✅ Zero circular dependencies maintained across project
- ✅ Documentation (graphs, metrics) stays current automatically
- ✅ New developers get immediate feedback on violations
- ✅ Code reviews focus on business logic, not architecture
- ⚠️ Pre-commit hook adds ~2 seconds to commit time
- ⚠️ Initial setup requires configuring dependency-cruiser rules
- ⚠️ False positives may require rule tuning

**Alternatives Considered**:

1. **Manual code reviews only**
   - ❌ Rejected: Too slow, error-prone, inconsistent
   - ❌ Catches violations late in development cycle

2. **Madge alone**
   - ❌ Rejected: Good for circular deps, but no layer boundary enforcement
   - ❌ No real-time IDE feedback

3. **Custom scripts**
   - ❌ Rejected: Maintenance burden, less robust than established tools
   - ❌ No community support or documentation

**Implementation Checklist**:
- ✅ Install dependency-cruiser and ESLint boundaries plugin
- ✅ Configure `.dependency-cruiser.js` with layer rules
- ✅ Add ESLint boundaries to `.eslintrc.json`
- ✅ Set up pre-commit hook with Husky
- ✅ Add CI/CD validation step
- ✅ Generate initial dependency graphs
- ✅ Document violation resolution process

**Related ADRs**:
- [ADR-001: Layered Architecture](./001-layered-architecture.md) - Defines the layers being enforced
- [ADR-002: Layer Placement Decision Tree](./002-layer-placement-decision-tree.md) - How to determine correct layer
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - What belongs in each layer

---

**Last Updated**: January 11, 2026
