import { inject } from '@angular/core';

import { type HttpClient } from '@lib/http-client/domain';

import { VAULT_HTTP_CLIENT_TOKEN } from '../injection-tokens';

export const injectVaultHttpClient = (): HttpClient => inject(VAULT_HTTP_CLIENT_TOKEN);
