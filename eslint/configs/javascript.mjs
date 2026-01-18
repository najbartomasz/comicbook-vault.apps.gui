
import eslint from '@eslint/js';

import { coreRules } from '../rules/core.mjs';

export const javascriptConfig = [
    {
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module'
        },
        rules: {
            ...eslint.configs.recommended.rules,
            ...coreRules
        }
    }
];
