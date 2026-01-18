import { type ApplicationRef } from '@angular/core';
import { type BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from '@shell';

import { config } from './app.config.server';

const bootstrap = async (context: BootstrapContext): Promise<ApplicationRef> => (
    bootstrapApplication(AppComponent, config, context)
);
// eslint-disable-next-line import/no-default-export
export default bootstrap;
