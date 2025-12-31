// Learn more about Vitest configuration options at https://vitest.dev/config/
import { playwright } from '@vitest/browser-playwright';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const VIEWPORT = { width: 1920, height: 1080 };

export default defineConfig({
    plugins: [viteTsConfigPaths()],
    test: {
        globals: true,
        restoreMocks: true,
        mockReset: true,
        reporters: ['tree'],
        coverage: {
            reportsDirectory: './coverage/comicbook-vault.apps.gui',
            cleanOnRerun: true,
            reporter: ['lcov', 'text', 'html', 'json-summary'],
            exclude: ['**/testing/**']
        },
        browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            testerHtmlPath: './src/index.html',
            viewport: VIEWPORT,
            provider: playwright({
                contextOptions: { viewport: VIEWPORT }
            })
        }
    }
});
