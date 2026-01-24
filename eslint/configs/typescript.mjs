import path from 'node:path';
import { fileURLToPath } from 'node:url';

import angularEslint from '@angular-eslint/eslint-plugin';
import eslint from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import boundariesPlugin from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import securityPlugin from 'eslint-plugin-security';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { angularRules } from '../rules/angular.mjs';
import { boundariesRules } from '../rules/boundaries.mjs';
import { coreRules } from '../rules/core.mjs';
import { importRules } from '../rules/imports.mjs';
import { indexFileRules } from '../rules/index-files.mjs';
import { promiseRules } from '../rules/promise.mjs';
import { securityRules } from '../rules/security.mjs';
import { sonarjsRules } from '../rules/sonarjs.mjs';
import { stylisticRules } from '../rules/stylistic.mjs';
import { typescriptRules } from '../rules/typescript.mjs';
import { boundariesElements } from '../settings/boundaries-elements.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../');

export const typescriptConfig = [
    {
        ...eslint.configs.recommended,
        files: ['**/*.ts']
    },
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['**/*.ts']
    })),
    ...tseslint.configs.stylistic.map((config) => ({
        ...config,
        files: ['**/*.ts']
    })),
    {
        files: ['**/*.ts'],
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: 'tsconfig.app.json',
                tsconfigRootDir: projectRoot,
                ecmaVersion: 2024,
                sourceType: 'module'
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: path.resolve(projectRoot, 'tsconfig.app.json')
                }
            },
            'import/internal-regex': '^@(lib|features|shell|testing)/',
            'boundaries/root-path': projectRoot,
            'boundaries/dependency-nodes': ['import'],
            'boundaries/elements': boundariesElements,
            'boundaries/include': ['src/app/**', 'src/app-providers/**', 'src/testing/**'],
            'boundaries/ignore': ['**/*.spec.ts', '**/*.e2e.spec.ts', '**/*.integration.spec.ts', '**/*.visual.spec.ts']
        },
        plugins: {
            '@angular-eslint': angularEslint,
            '@stylistic': stylisticPlugin,
            boundaries: boundariesPlugin,
            import: importPlugin,
            promise: promisePlugin,
            sonarjs: sonarjsPlugin,
            security: securityPlugin
        },
        rules: {
            ...angularEslint.configs.recommended.rules,
            ...coreRules,
            ...stylisticRules,
            ...angularRules,
            ...typescriptRules,
            ...importRules,
            ...promiseRules,
            ...sonarjsRules,
            ...securityRules,
            ...boundariesRules
        }
    },
    {
        files: ['**/index.ts'],
        rules: indexFileRules
    }
];
