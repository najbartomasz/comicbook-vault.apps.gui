# ADR-016: State Management Strategy for Complex Features

**Status**: 🔄 Proposed

**Context**:
As the application grows, complex features may require shared state management beyond component signals.

**Decision**:
TBD - Evaluate when first complex feature requires it.

**Options to Consider**:
- NgRx SignalStore (signals-based, lightweight)
- TanStack Query (for server state)
- Custom services with signals
- RxJS subjects for event streams

---

**Last Updated**: January 11, 2026
