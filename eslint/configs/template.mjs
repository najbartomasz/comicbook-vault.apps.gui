import angularTemplateEslint from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

import { angularTemplateRules } from '../rules/angular-template.mjs';

export const templateConfig = [
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: angularTemplateParser
        },
        plugins: {
            '@angular-eslint/template': angularTemplateEslint
        },
        rules: {
            ...angularTemplateEslint.configs.recommended.rules,
            ...angularTemplateEslint.configs.accessibility.rules,
            ...angularTemplateRules
        }
    }
];
