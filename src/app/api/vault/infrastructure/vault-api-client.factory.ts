import { DateTimeProvider } from '@lib/date-time/infrastructure';
import {
    type HttpInterceptor,
    RequestLoggerHttpInterceptor,
    ResponseLoggerHttpInterceptor,
    ResponseTimeHttpInterceptor,
    SequenceNumberHttpInterceptor,
    TimestampHttpInterceptor
} from '@lib/http-client/application';
import { HttpUrl } from '@lib/http-client/domain';
import { FetchHttpClient, JsonResponseBodyParser, TextPlainResponseBodyParser } from '@lib/http-client/infrastructure';
import { PerformanceTimestampProvider } from '@lib/performance/infrastructure';

import { VaultApiClient } from './vault-api-client';

export const createVaultApiClient = (baseUrl: string): VaultApiClient => {
    const url = HttpUrl.create(baseUrl);
    const httpInterceptors: HttpInterceptor[] = [
        new ResponseLoggerHttpInterceptor(),
        new SequenceNumberHttpInterceptor(),
        new TimestampHttpInterceptor(new DateTimeProvider()),
        new RequestLoggerHttpInterceptor(),
        new ResponseTimeHttpInterceptor(new PerformanceTimestampProvider())
    ];
    const httpClient = new FetchHttpClient(
        url,
        [new JsonResponseBodyParser(), new TextPlainResponseBodyParser()],
        httpInterceptors
    );
    return new VaultApiClient(httpClient);
};
