import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from '@shell';

import { config } from './app.config.client';

try {
    await bootstrapApplication(AppComponent, config);
} catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err);
}
