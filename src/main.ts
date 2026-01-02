import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent, appConfigClient } from '@shell';

try {
    await bootstrapApplication(AppComponent, appConfigClient);
} catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err);
}
