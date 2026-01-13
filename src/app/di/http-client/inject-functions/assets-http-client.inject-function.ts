import { inject } from '@angular/core';

import { type HttpClient } from '@lib/http-client/domain';

import { ASSETS_HTTP_CLIENT_TOKEN } from '../injection-tokens';

export const injectAssetsHttpClient = (): HttpClient => inject(ASSETS_HTTP_CLIENT_TOKEN);
