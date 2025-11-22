import { join } from 'node:path';

import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
    express.static(browserDistFolder, {
        maxAge: '1y',
        index: false,
        redirect: false
    })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
    angularApp
        .handle(req)
        // eslint-disable-next-line promise/prefer-await-to-then
        .then(async (response) =>
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, promise/no-callback-in-promise
            response ? writeResponseToNodeResponse(response, res) : next()
        )
        // eslint-disable-next-line promise/prefer-await-to-then, promise/no-callback-in-promise
        .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
const defaultPort = 4000;
if (isMainModule(import.meta.url) || process.env['pm_id']) {
    const port = process.env['PORT'] ?? defaultPort;
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    app.listen(port, (error) => {
        if (error) {
            throw error;
        }
        // eslint-disable-next-line no-console
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
