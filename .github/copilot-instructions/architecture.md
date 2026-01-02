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

### Layer Color Standards (ordered top to bottom)
- 🔵 Blue = Presentation Layer
- 🟣 Purple = Infrastructure Layer
- 🟠 Orange = Domain Layer
- 🟩 Teal = Lib Container
- 🟥 Rose = Features Container

## When modifying `/docs/ADR.md`:

### ADR Format Standards
- Number ADRs sequentially (ADR-001, ADR-002, etc.)
- Follow consistent format for each ADR:
  - **Status**: ✅ Accepted, 🔄 Proposed, ⛔ Rejected, 📦 Deprecated
  - **Context**: Why the decision was needed
  - **Decision**: What was chosen
  - **Rationale**: Bullet points explaining why (when applicable)
  - **Consequences**: Pros/cons with ✅ and ⚠️ emojis
  - **Alternatives Considered**: When applicable

### ADR Management
- Maintain table of contents with ADR numbers, titles, and status indicators
- Keep ADRs immutable - mark old ones as deprecated and create new ADR if decision changes
- Link related ADRs when they reference each other

### Scaling Strategy
When file exceeds 25 ADRs, split into individual files:
1. Create `docs/adr/` directory
2. Move each ADR to `docs/adr/001-layered-architecture.md`, `002-framework-agnostic-core.md`, etc.
3. Create `docs/adr/README.md` as index with links to all ADRs
4. Update `docs/ARCHITECTURE.md` to link to `docs/adr/README.md` instead of `docs/ADR.md`
