import { defineConfig, mergeConfig } from 'vitest/config';

import vitestConfig from './vitest.config';

export default mergeConfig(vitestConfig, defineConfig({
    test: {
        coverage: {
            reportsDirectory: './coverage/unit',
            thresholds: {
                branches: 100,
                functions: 100,
                lines: 100,
                statements: 100,
                perFile: true
            },
            watermarks: {
                statements: [100, 100],
                branches: [100, 100],
                functions: [100, 100],
                lines: [100, 100]
            }
        }
    }
}));
