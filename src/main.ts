import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent, appConfig } from '@presentation';

try {
    await bootstrapApplication(AppComponent, appConfig);
} catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err);
}
