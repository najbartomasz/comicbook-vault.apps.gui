import { defineConfig, mergeConfig } from 'vitest/config';

import vitestConfig from './vitest.config';

export default mergeConfig(vitestConfig, defineConfig({
    test: {
        coverage: {
            reportsDirectory: './coverage/visual',
            watermarks: {
                statements: [0, 0],
                branches: [0, 0],
                functions: [0, 0],
                lines: [0, 0]
            }
        },
        browser: {
            headless: true,
            screenshotFailures: true
        }
    }
}));
