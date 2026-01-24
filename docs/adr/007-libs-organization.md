# ADR-007: Libs Organization (Core, Generic, Supporting)

**Status**: ✅ Accepted

**Context**:
The `lib/` directory contains shared code, but without clear distinction between different types of subdomains, it can become a dumping group.
We need a structure that explicitly categorizes code based on its relationship to the business domain, following DDD principles.
This helps developers quickly identify whether a library is reusable across any project (Generic), specific to this application (Supporting), or shared business logic (Core/Shared Kernel).

**Decision**:
Organize `src/app/lib` into clear category directories based on DDD Subdomain types.

**Structure**:

```
src/app/
├── features/               # CORE DOMAINS (The "Business Value")
│   └── (Feature Modules)   # Vertical slices (e.g., vault-browser)
│
└── lib/                    # SHARED SUBDOMAINS
    ├── core/               # SHARED KERNEL (Shared Domain Logic)
    │   └── common-types/   # Shared Value Objects / Entities (e.g., Money, UserID)
    │
    ├── generic/            # GENERIC SUBDOMAINS
    │   ├── http-client/    # Reusable HTTP wrapper
    │   ├── date-time/      # Reusable Date wrapper
    │   └── endpoint/       # Reusable path utilities
    │
    └── supporting/         # SUPPORTING SUBDOMAINS
        ├── app-config/     # App-specific configuration logic
        ├── api-client/     # Backend-specific API clients
        └── ui-kit/         # App-specific UI components
```

**Category Definitions:**

### 1. Features (`src/app/features/`) - **CORE DOMAIN**
*   **Definition:** The unique value proposition of the application. The complexities here are the reason the software exists.
*   **Characteristics:** High business complexity, frequently changing business rules.
*   **Examples:** `vault-browser`, `comic-reader`, `collection-manager`.

### 2. Core Libs (`src/app/lib/core/`) - **SHARED KERNEL**
*   **Definition:** Shared **Business/Domain** logic used by multiple features.
*   **Test:** "Is it Business Logic?" -> **Yes**. "Is it specific to one feature?" -> **No**.
*   **Characteristics:** Contains Value Objects, shared Entities, or Domain Services that cross module boundaries. High stability required as changes affect multiple features.
*   **Examples:** `common-domain-types` (e.g. `Money`, `Email`), `shared-rules`.

### 3. Generic Libs (`src/app/lib/generic/`) - **GENERIC SUBDOMAIN**
*   **Definition:** Solved problems that are not specific to the business.
*   **Test:** "Could I publish this to NPM and use it in a Toaster App?" -> **Yes**.
*   **Characteristics:** Purely technical, no knowledge of "Comics" or "API Endpoints".
*   **Examples:** `http-client`, `logger`, `date-utils`, `performance-monitor`.

### 4. Supporting Libs (`src/app/lib/supporting/`) - **SUPPORTING SUBDOMAIN**
*   **Definition:** Necessary logic for *this specific application* to work, but not the core business differentiator.
*   **Test:** "Could I use this in another app?" -> **No** (it's too specific). "Is it the main feature?" -> **No** (it's plumbing).
*   **Characteristics:** Knows about application data types/endpoints but performs standard support tasks.
*   **Examples:** `app-config` (knows specific keys), `api-client` (knows specific URLs), `auth-client`.

**Consequences**:

**Benefits:**
- ✅ **Cognitive Clarity:** Developers know instantly if code is technical plumbing (Generic) or app-specific plumbing (Supporting).
- ✅ **Reusability:** `generic/` folders are ready for extraction to shared libraries/NPM.
- ✅ **Focus:** Keep `features/` clean for high-value business logic only.
- ✅ **DDD Alignment:** Explicitly maps directory structure to Strategic DDD patterns.

**Tradeoffs:**
- ⚠️ **Nesting:** Adds one level of directory depth to `lib/`.
- ⚠️ **Decision Fatigue:** Requires developers to categorize new libs (though the "NPM Test" makes this easy).

**Related ADRs**:
- [ADR-003: DDD Layer Responsibilities](./003-ddd-layer-responsibilities.md) - Defines layers *inside* these contexts.

---
