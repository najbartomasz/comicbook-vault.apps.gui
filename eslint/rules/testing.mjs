export const testingRules = {
    // Allow direct vitest imports in testing utilities (adapter layer)
    // Also allow internal testing module organization
    'no-restricted-imports': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unsafe-type-assertion': 'off',
    'import/no-internal-modules': 'off'
};
