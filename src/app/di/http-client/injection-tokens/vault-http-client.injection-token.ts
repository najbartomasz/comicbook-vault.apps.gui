import { InjectionToken } from '@angular/core';

import { type HttpClient } from '@lib/http-client/domain';

export const VAULT_HTTP_CLIENT_TOKEN = new InjectionToken<HttpClient>('VaultHttpClient');
