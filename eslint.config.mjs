import { javascriptConfig } from './eslint/configs/javascript.mjs';
import { templateConfig } from './eslint/configs/template.mjs';
import { testingConfig } from './eslint/configs/testing.mjs';
import { typescriptConfig } from './eslint/configs/typescript.mjs';

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.angular/**']
    },
    ...javascriptConfig,
    ...typescriptConfig,
    ...templateConfig,
    ...testingConfig
];
