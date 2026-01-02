import { InjectionToken } from '@angular/core';

import { type UserConfig } from 'src/config/user';

export const USER_CONFIG_TOKEN = new InjectionToken<UserConfig>('UserConfig');
