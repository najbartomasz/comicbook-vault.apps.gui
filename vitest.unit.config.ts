import { defineConfig, mergeConfig } from 'vitest/config';

import vitestConfig from './vitest.config';

export default mergeConfig(vitestConfig, defineConfig({
    test: {
        exclude: ['**/*.visual.spec.ts'],
        browser: {
            headless: false
        }
    }
}));
