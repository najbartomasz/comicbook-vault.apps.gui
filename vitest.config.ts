// Learn more about Vitest configuration options at https://vitest.dev/config/
import { playwright } from '@vitest/browser-playwright';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [viteTsConfigPaths()],
    test: {
        globals: true,
        restoreMocks: true,
        mockReset: true,
        coverage: {
            cleanOnRerun: true,
            reporter: [
                'lcov',
                'text',
                'html',
                'json-summary'
            ],
            thresholds: {
                branches: 100,
                functions: 100,
                lines: 100,
                statements: 100,
                perFile: true
            },
            watermarks: {
                statements: [
                    100,
                    100
                ],
                branches: [
                    100,
                    100
                ],
                functions: [
                    100,
                    100
                ],
                lines: [
                    100,
                    100
                ]
            },
            exclude: ['**/testing/**']
        },
        browser: {
            provider: playwright({
                contextOptions: {
                    viewport: { width: 1920, height: 1080 }
                }
            }),
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            testerHtmlPath: './src/index.html',
            viewport: { width: 1920, height: 1080 }
        },
        reporters: ['tree']
    }
});
