
import eslint from '@eslint/js';
import globals from 'globals';

import { coreRules } from '../rules/core.mjs';

const commonRules = {
    ...eslint.configs.recommended.rules,
    ...coreRules
};

export const javascriptConfig = [
    {
        files: ['**/*.mjs'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.node
            }
        },
        rules: {
            ...commonRules
        }
    },
    {
        files: ['**/*.js', '**/*.cjs'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'commonjs',
            globals: {
                ...globals.node
            }
        },
        rules: {
            ...commonRules
        }
    }
];
