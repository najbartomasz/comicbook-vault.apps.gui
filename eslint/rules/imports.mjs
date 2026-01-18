export const importRules = {
    'import/consistent-type-specifier-style': [
        'error',
        'prefer-inline'
    ],
    'import/default': 'error',
    'import/dynamic-import-chunkname': 'off',
    'import/export': 'error',
    'import/exports-last': 'error',
    'import/extensions': [
        'error',
        'ignorePackages',
        {
            ts: 'never',
            js: 'never'
        }
    ],
    'import/first': 'error',
    'import/group-exports': 'error',
    'import/imports-first': 'error',
    'import/max-dependencies': [
        'error',
        {
            max: 15,
            ignoreTypeImports: true
        }
    ],
    'import/named': 'error',
    'import/namespace': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-amd': 'error',
    'import/no-anonymous-default-export': 'error',
    'import/no-commonjs': 'error',
    'import/no-cycle': 'error',
    'import/no-default-export': 'error',
    'import/no-deprecated': 'error',
    'import/no-duplicates': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-empty-named-blocks': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-import-module-exports': 'error',
    'import/no-internal-modules': 'off',
    'import/no-mutable-exports': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-named-default': 'error',
    'import/no-named-export': 'off',
    'import/no-namespace': 'error',
    'import/no-nodejs-modules': 'off',
    'import/no-relative-packages': 'error',
    'import/no-relative-parent-imports': 'off',
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
    'import/no-self-import': 'error',
    'import/no-unassigned-import': 'error',
    'import/no-unresolved': 'error',
    'import/no-unused-modules': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/order': [
        'error',
        {
            groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index'
            ],
            'newlines-between': 'always',
            alphabetize: {
                order: 'asc',
                caseInsensitive: true
            }
        }
    ],
    'import/prefer-default-export': 'off',
    'import/unambiguous': 'error',
};
