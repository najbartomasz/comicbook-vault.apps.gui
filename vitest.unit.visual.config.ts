import { defineConfig, mergeConfig } from 'vitest/config';

import vitestConfig from './vitest.config';

export default mergeConfig(vitestConfig, defineConfig({
    test: {
        browser: {
            headless: true,
            viewport: { width: 1920, height: 1080 }
        }
    }
}));
