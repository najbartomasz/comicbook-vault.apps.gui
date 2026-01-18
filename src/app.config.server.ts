import { type ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { sharedConfig } from './app.config.shared';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
    providers: [provideServerRendering(withRoutes(serverRoutes))]
};

export const config = mergeApplicationConfig(sharedConfig, serverConfig);
