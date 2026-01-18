import { DateTimeProvider } from '@lib/date-time/infrastructure';
import {
    RequestLoggerHttpInterceptor,
    ResponseLoggerHttpInterceptor,
    ResponseTimeHttpInterceptor,
    SequenceNumberHttpInterceptor,
    TimestampHttpInterceptor,
    type HttpInterceptor
} from '@lib/http-client/application';
import { HttpUrl } from '@lib/http-client/domain';
import { FetchHttpClient, JsonResponseBodyParser, TextPlainResponseBodyParser } from '@lib/http-client/infrastructure';
import { PerformanceTimestampProvider } from '@lib/performance/infrastructure';

import { AssetsApiClient } from './assets-api-client';

export const createAssetsApiClient = (baseUrl: string): AssetsApiClient => {
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
    return new AssetsApiClient(httpClient);
};
