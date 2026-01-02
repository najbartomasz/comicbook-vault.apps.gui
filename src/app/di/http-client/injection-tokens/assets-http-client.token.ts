import { InjectionToken } from '@angular/core';

import { type HttpClient } from '@lib/http-client/domain';

export const ASSETS_HTTP_CLIENT_TOKEN = new InjectionToken<HttpClient>('AssetsHttpClient');
