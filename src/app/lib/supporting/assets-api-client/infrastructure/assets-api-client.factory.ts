import { SystemDateTime } from '@lib/generic/date-time/infrastructure';
import {
    RequestLoggerHttpInterceptor,
    ResponseLoggerHttpInterceptor,
    ResponseTimeHttpInterceptor,
    SequenceNumberHttpInterceptor,
    TimestampHttpInterceptor
} from '@lib/generic/http-client/application';
import { type HttpInterceptor, HttpUrl } from '@lib/generic/http-client/domain';
import { FetchHttpClient, JsonResponseBodyParser, TextPlainResponseBodyParser } from '@lib/generic/http-client/infrastructure';
import { PerformanceTimestamp } from '@lib/generic/performance/infrastructure';

import { type AssetsApiClient } from '../domain';

import { HttpAssetsApiClient } from './http-assets-api-client';

export const createAssetsApiClient = (baseUrl: string): AssetsApiClient => {
    const url = HttpUrl.create(baseUrl);
    const httpInterceptors: HttpInterceptor[] = [
        new ResponseLoggerHttpInterceptor(),
        new SequenceNumberHttpInterceptor(),
        new TimestampHttpInterceptor(new SystemDateTime()),
        new RequestLoggerHttpInterceptor(),
        new ResponseTimeHttpInterceptor(new PerformanceTimestamp())
    ];
    const httpClient = new FetchHttpClient(
        url,
        [new JsonResponseBodyParser(), new TextPlainResponseBodyParser()],
        httpInterceptors
    );
    return new HttpAssetsApiClient(httpClient);
};
