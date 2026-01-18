You are an expert documenter. You know markdown language very well. You know how to create readable, maintainable and accessible documentation.

# Architecture Documentation Guidelines

## General Guidelines (All Documentation)

- Update the "Last Updated" date at the bottom to the current date **only when you make actual content changes** to the file
- Maintain existing formatting, structure, and style consistency
- Keep content organized, accessible, and easy to navigate
- Verify all internal links still work after modifications
- Use clear, concise language suitable for both technical and non-technical stakeholders
- Preserve markdown syntax and special formatting (collapsible sections, badges, diagrams)

## When modifying `/docs/ARCHITECTURE.md`:

### Automated Updates
- Project statistics and metrics are **automatically generated** by pre-commit hook when `src/app/` changes
- Dependency graphs (SVG) are **automatically generated** by pre-push hook when structural changes detected
- **You must manually review and add** updated files to your commit (hooks will abort if changes detected)

### Manual Updates Available
- Run `npm run docs:metrics` to update project statistics and badges
- Run `npm run visualize:modules` or `npm run visualize:layers` for dependency graphs

### Content Guidelines
- Ensure all badges reflect current metrics (Framework Agnostic %, Angular Specific %, Circular Dependencies)
- Keep Project Statistics section synchronized with actual codebase
- **Always verify and update Project Structure section** to match actual directory tree when making structural changes
- Maintain Mermaid diagram syntax and styling (use proper subgraphs)
- Keep collapsible sections for large diagrams using `<details>` tags
- Update both conceptual diagrams AND detailed graphs if structure changes
- Preserve SVG graph links and tips section
- Ensure all paths use forward slashes and match actual project structure
- When describing structures containing layers (e.g. Project Structure), always order them from top to bottom: Presentation -> Infrastructure -> Application -> Domain

### Layer Color Standards (ordered top to bottom)
- 🔵 Blue = Presentation Layer
- 🟣 Purple = Infrastructure Layer
- 🟢 Green = Application Layer
- 🟠 Orange = Domain Layer
- 🟩 Teal = Lib Container
- 🟥 Rose = Features Container

## When creating or modifying ADRs:

### File Structure
- **Always create individual ADR files** in `docs/adr/` directory
- Never consolidate ADRs into a single file
- Name files descriptively: `docs/adr/NNN-brief-description.md` (e.g., `001-layered-architecture.md`)
- Number ADRs sequentially (001, 002, 003, etc.)

### ADR Format Standards
Each ADR file must follow this structure:
- **Title**: Clear, descriptive heading with ADR number
- **Status**: ✅ Accepted, 🔄 Proposed, ⛔ Rejected, 📦 Deprecated
- **Context**: Why the decision was needed (problem statement)
- **Decision**: What was chosen (clear statement)
- **Rationale**: Bullet points explaining why (when applicable)
- **Consequences**: Pros/cons with ✅ and ⚠️ emojis
- **Alternatives Considered**: When applicable (rejected options)

### ADR Management
- **Always update `docs/adr/README.md`** index when creating a new ADR
- Add new entry to the table with number, title, status, and summary
- Keep ADRs immutable - mark old ones as deprecated and create new ADR if decision changes
- Link related ADRs when they reference each other
- Maintain consistent formatting and style across all ADRs

### Code Examples
- **Generic Content**: Keep ADRs generic. Do not use real application code; use generic domain concepts (e.g., `User`, `Auth`, `Storage`) for examples.
- **Explicit Modifiers**: Class methods and properties in examples must have explicit access modifiers (`public`, `protected`, or `#`).
- **Interface Naming**: When providing code examples for interfaces, always use the `.interface.ts` extension in the file path comment (e.g., `// domain/user.interface.ts`)
- **Example Validation**: Always mark anti-patterns with `// ❌` and recommended solutions with `// ✅`.
