import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, type Provider } from '@angular/core';

import { DateTimeProvider } from '@lib/date-time/infrastructure';
import {
    RequestLoggerHttpInterceptor,
    ResponseLoggerHttpInterceptor,
    ResponseTimeHttpInterceptor,
    SequenceNumberHttpInterceptor,
    TimestampHttpInterceptor,
    type HttpInterceptor
} from '@lib/http-client/application';
import { HttpUrl, type HttpClient } from '@lib/http-client/domain';
import { FetchHttpClient, JsonResponseBodyParser, TextPlainResponseBodyParser } from '@lib/http-client/infrastructure';
import { PerformanceTimestampProvider } from '@lib/performance/infrastructure';

import { ASSETS_HTTP_CLIENT_TOKEN } from '../injection-tokens';

export const provideAssetsHttpClient = (): Provider => ({
    provide: ASSETS_HTTP_CLIENT_TOKEN,
    useFactory: (platformId: object): HttpClient => {
        if (!isPlatformBrowser(platformId)) {
            throw new Error('AssetsHttpClient is not available on server. Use direct file system access instead.');
        }
        const httpInterceptors: HttpInterceptor[] = [
            new ResponseLoggerHttpInterceptor(),
            new SequenceNumberHttpInterceptor(),
            new TimestampHttpInterceptor(new DateTimeProvider()),
            new RequestLoggerHttpInterceptor(),
            new ResponseTimeHttpInterceptor(new PerformanceTimestampProvider())
        ];
        return new FetchHttpClient(
            HttpUrl.create(globalThis.location.origin),
            [new JsonResponseBodyParser(), new TextPlainResponseBodyParser()],
            httpInterceptors
        );
    },
    deps: [PLATFORM_ID]
});
