export const specRules = {
    // TypeScript ESLint Rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/init-declarations': 'off',
    '@typescript-eslint/naming-convention': [
        'error',
        {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
        },
        {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
        },
        {
            selector: 'typeLike',
            format: ['PascalCase']
        },
        {
            selector: 'enumMember',
            format: ['PascalCase']
        },
        {
            selector: 'property',
            format: null
        }
    ],
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-type-assertion': 'off',
    // Import Rules
    'import/no-internal-modules': 'off',
    'import/no-restricted-paths': [
        'error',
        {
            zones: [
                {
                    target: './src/**/*.spec.ts',
                    from: './src/testing/e2e/**',
                    message: 'Unit tests (*.spec.ts) cannot import from testing/e2e. Use *.e2e.spec.ts for E2E tests.'
                },
                {
                    target: './src/**/*.e2e.spec.ts',
                    from: './src/testing/unit/**',
                    message: 'E2E tests (*.e2e.spec.ts) cannot import from testing/unit. Use *.spec.ts for unit tests.'
                }
            ]
        }
    ],
    // Promise Rules
    'promise/avoid-new': 'off',
    'sonarjs/max-lines': 'off',
    'sonarjs/max-lines-per-function': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/no-nested-functions': 'off'
};

export const integrationSpecRules = {
    // Vitest Rules
    'vitest/max-expects': 'off'
};
