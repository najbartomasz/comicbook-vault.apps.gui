import { type ApplicationRef } from '@angular/core';
import { type BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { AppComponent, appConfigServer } from '@shell';

const bootstrap = async (context: BootstrapContext): Promise<ApplicationRef> =>
    bootstrapApplication(AppComponent, appConfigServer, context);
// eslint-disable-next-line import/no-default-export
export default bootstrap;
