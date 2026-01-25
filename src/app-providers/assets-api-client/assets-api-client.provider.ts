import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { type EnvironmentProviders, makeEnvironmentProviders, PLATFORM_ID } from '@angular/core';

import { AssetsApiClient } from '@lib/supporting/assets-api-client/domain';
import { createAssetsApiClient } from '@lib/supporting/assets-api-client/infrastructure';

export const provideAssetsApiClient = (): EnvironmentProviders => (
    makeEnvironmentProviders([
        {
            provide: AssetsApiClient,
            useFactory: (platformId: object, document: Document) => {
                if (!isPlatformBrowser(platformId)) {
                    throw new Error('AssetsHttpClient is not available on server. Use direct file system access instead.');
                }
                return createAssetsApiClient(document.location.origin);
            },
            deps: [PLATFORM_ID, DOCUMENT]
        }
    ])
);
