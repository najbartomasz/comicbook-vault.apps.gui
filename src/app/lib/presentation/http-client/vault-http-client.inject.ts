import { inject } from '@angular/core';

import { type HttpClient } from '@lib/infrastructure/http';

import { VAULT_HTTP_CLIENT_TOKEN } from './vault-http-client.token';

export const injectVaultHttpClient = (): HttpClient => inject(VAULT_HTTP_CLIENT_TOKEN);
