// Learn more about Vitest configuration options at https://vitest.dev/config/
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            reporter: [
                "lcov",
                "text",
                "html"
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
            exclude: [
                "**/testing/**"
            ]
        },
        browser: {
            provider: playwright(),
            enabled: true,
            screenshotFailures: true,
            instances: [{ browser: 'chromium' }]
        }
    }
});
