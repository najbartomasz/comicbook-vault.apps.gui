import path from 'node:path';
import { fileURLToPath } from 'node:url';

import angularEslint from '@angular-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

import { integrationSpecRules, specRules } from '../rules/specs.mjs';
import { testingRules } from '../rules/testing.mjs';
import { vitestConfigRules } from '../rules/vitest-config.mjs';
import { vitestRules } from '../rules/vitest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../');

export const testingConfig = [
    {
        files: ['**/*.spec.ts', 'vitest*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: 'tsconfig.spec.json',
                tsconfigRootDir: projectRoot
            },
            globals: {
                ...vitest.environments.env.globals
            }
        },
        plugins: {
            '@angular-eslint': angularEslint,
            '@typescript-eslint': tseslint.plugin,
            vitest
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: path.resolve(projectRoot, 'tsconfig.spec.json')
                }
            },
            vitest: {
                typecheck: true
            }
        },
        rules: {
            ...specRules,
            ...vitestRules
        }
    },
    {
        files: ['**/*.integration.spec.ts'],
        rules: integrationSpecRules
    },
    {
        files: ['**/testing/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: 'tsconfig.spec.json',
                tsconfigRootDir: projectRoot
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: path.resolve(projectRoot, 'tsconfig.spec.json')
                }
            }
        },
        rules: testingRules
    },
    {
        files: ['vitest*.config.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: 'tsconfig.spec.json',
                tsconfigRootDir: projectRoot
            }
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: path.resolve(projectRoot, 'tsconfig.spec.json')
                }
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin
        },
        rules: vitestConfigRules
    }
];
