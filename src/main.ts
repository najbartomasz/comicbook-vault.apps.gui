import { bootstrapApplication } from '@angular/platform-browser';
// eslint-disable-next-line import/no-internal-modules
import { AppComponent } from './app/app.component';
// eslint-disable-next-line import/no-internal-modules
import { appConfig } from './app/app.config';

try {
    await bootstrapApplication(AppComponent, appConfig);
} catch (err: unknown) {
    console.error(err);
}
