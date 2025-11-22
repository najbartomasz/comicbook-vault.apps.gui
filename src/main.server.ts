import type { ApplicationRef } from '@angular/core';
import type { BootstrapContext } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';
// eslint-disable-next-line import/no-internal-modules
import { AppComponent } from './app/app.component';
// eslint-disable-next-line import/no-internal-modules
import { config } from './app/app.config.server';

const bootstrap = async (context: BootstrapContext): Promise<ApplicationRef> =>
    bootstrapApplication(AppComponent, config, context);

// eslint-disable-next-line import/no-default-export
export default bootstrap;
