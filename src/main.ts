import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent, appConfig } from '@presentation';

try {
    await bootstrapApplication(AppComponent, appConfig);
} catch (err: unknown) {
    console.error(err);
}
