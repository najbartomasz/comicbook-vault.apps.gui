import { inject } from '@angular/core';

import { type UserConfig } from 'src/config/user';

import { USER_CONFIG_TOKEN } from '../injection-tokens';

export const injectUserConfig = (): UserConfig => inject(USER_CONFIG_TOKEN);

