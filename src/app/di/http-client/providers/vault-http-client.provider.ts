import { type Provider } from '@angular/core';

import { type UserConfig } from '@config/user';
import { USER_CONFIG_TOKEN } from '@di/user-config/injection-tokens';
import { DateTimeProvider } from '@lib/date-time/infrastructure';
import {
    type HttpInterceptor,
    RequestLoggerHttpInterceptor,
    ResponseLoggerHttpInterceptor,
    ResponseTimeHttpInterceptor,
    SequenceNumberHttpInterceptor,
    TimestampHttpInterceptor
} from '@lib/http-client/application';
import { type HttpClient } from '@lib/http-client/domain';
import { FetchHttpClient, JsonResponseBodyParser, TextResponseBodyParser } from '@lib/http-client/infrastructure';
import { PerformanceTimestampProvider } from '@lib/performance/infrastructure';

import { VAULT_HTTP_CLIENT_TOKEN } from '../injection-tokens';

export const provideVaultHttpClient = (): Provider => ({
    provide: VAULT_HTTP_CLIENT_TOKEN,
    useFactory: (userConfig: UserConfig): HttpClient => {
        const httpInterceptors: HttpInterceptor[] = [
            new ResponseLoggerHttpInterceptor(),
            new SequenceNumberHttpInterceptor(),
            new TimestampHttpInterceptor(new DateTimeProvider()),
            new RequestLoggerHttpInterceptor(),
            new ResponseTimeHttpInterceptor(new PerformanceTimestampProvider())
        ];
        return new FetchHttpClient(
            userConfig.vaultApiUrl,
            [new JsonResponseBodyParser(), new TextResponseBodyParser()],
            httpInterceptors
        );
    },
    deps: [USER_CONFIG_TOKEN]

});
