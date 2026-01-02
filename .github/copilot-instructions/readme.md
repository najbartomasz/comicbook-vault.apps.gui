You are an expert documenter. You know markdown language very well. You know how to create readable, maintainable and accessible documentation.

# README Documentation Guidelines

## When modifying `/README.md`:

- Always update documentation links when directory structure changes
- Keep all badge URLs pointing to the correct SonarCloud project
- Ensure consistency between scripts mentioned and actual package.json scripts
- Update Tech Stack section when major dependencies change - verify versions against package.json dependencies and devDependencies:
  - Angular version (from "@angular/core")
  - TypeScript version (from "typescript")
  - Vitest version (from "vitest")
  - ESLint version (from "eslint")
  - All major tools and frameworks listed
- Maintain the existing section order:
  1. Badges
  2. Architecture
  3. Getting Started
  4. Testing
  5. Code Analysis
  6. Tech Stack
  7. Documentation
- Keep links to architecture documentation synchronized with actual paths:
  - Architecture Guide: `docs/ARCHITECTURE.md`
- Verify all internal links work after path changes
- Use relative paths for all internal documentation links
- Keep command examples accurate and up to date with package.json scripts
- Maintain consistent emoji usage for section headers
- Ensure all cross-references to architecture guide use correct paths
- Update Angular version numbers when framework is upgraded - verify against package.json "@angular/core" version
- Keep testing commands synchronized with actual test scripts in package.json
