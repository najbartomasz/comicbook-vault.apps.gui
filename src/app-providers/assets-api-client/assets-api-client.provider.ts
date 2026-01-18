import { isPlatformBrowser } from '@angular/common';
import { type EnvironmentProviders, makeEnvironmentProviders, PLATFORM_ID } from '@angular/core';

import { AssetsApiClient, createAssetsApiClient } from '@api/assets/infrastructure';

export const provideAssetsApiClient = (): EnvironmentProviders => (
    makeEnvironmentProviders([
        {
            provide: AssetsApiClient,
            useFactory: (platformId: object) => {
                if (!isPlatformBrowser(platformId)) {
                    throw new Error('AssetsHttpClient is not available on server. Use direct file system access instead.');
                }
                return createAssetsApiClient(globalThis.location.origin);
            },
            deps: [PLATFORM_ID]
        }
    ])
);
