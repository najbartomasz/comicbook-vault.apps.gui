import { bootstrapApplication } from '@angular/platform-browser';
// eslint-disable-next-line import/no-internal-modules
import { AppComponent } from './app/app.component';
// eslint-disable-next-line import/no-internal-modules
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    .catch((err: unknown) => { console.error(err); });
