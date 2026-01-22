import { isPlatformBrowser } from '@angular/common';
import { type EnvironmentProviders, makeEnvironmentProviders, PLATFORM_ID } from '@angular/core';

import { AssetsRepository } from '@api/assets/domain';
import { createAssetsRepository } from '@api/assets/infrastructure';

export const provideAssetsApiClient = (): EnvironmentProviders => (
    makeEnvironmentProviders([
        {
            provide: AssetsRepository,
            useFactory: (platformId: object) => {
                if (!isPlatformBrowser(platformId)) {
                    throw new Error('AssetsHttpClient is not available on server. Use direct file system access instead.');
                }
                return createAssetsRepository(globalThis.location.origin);
            },
            deps: [PLATFORM_ID]
        }
    ])
);
