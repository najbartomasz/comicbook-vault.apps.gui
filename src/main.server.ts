import type { ApplicationRef } from '@angular/core';
import type { BootstrapContext } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent, appConfigServer } from '@presentation';

const bootstrap = async (context: BootstrapContext): Promise<ApplicationRef> =>
    bootstrapApplication(AppComponent, appConfigServer, context);
// eslint-disable-next-line import/no-default-export
export default bootstrap;
