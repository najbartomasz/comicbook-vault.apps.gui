import { SystemDateTime } from '@lib/date-time/infrastructure';
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
import { PerformanceTimestamp } from '@lib/performance/infrastructure';

import { type VaultRepository } from '../domain';

import { HttpVaultRepository } from './http-vault-repository';

export const createVaultRepository = (baseUrl: string): VaultRepository => {
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
    return new HttpVaultRepository(httpClient);
};
