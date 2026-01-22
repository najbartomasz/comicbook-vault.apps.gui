import { SystemDateTime } from '@lib/date-time/infrastructure';
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
import { PerformanceTimestamp } from '@lib/performance/infrastructure';

import { type AssetsRepository } from '../domain';

import { HttpAssetsRepository } from './http-assets-repository';

export const createAssetsRepository = (baseUrl: string): AssetsRepository => {
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
    return new HttpAssetsRepository(httpClient);
};
