import { InjectionToken } from '@angular/core';

import { DateTimeProvider } from '@lib/core/date-time';
import { PerformanceTimestampProvider } from '@lib/core/performance';
import {
    FetchHttpClient,
    JsonResponseBodyParser,
    RequestLoggerHttpInterceptor,
    ResponseLoggerHttpInterceptor,
    ResponseTimeHttpInterceptor,
    SequenceNumberHttpInterceptor,
    TextResponseBodyParser,
    TimestampHttpInterceptor,
    type HttpClient,
    type HttpInterceptor
} from '@lib/infrastructure/http';

export const VAULT_HTTP_CLIENT_TOKEN = new InjectionToken<HttpClient>('VaultHttpClient', {
    providedIn: 'root',
    factory: () => {
        const httpInterceptors: HttpInterceptor[] = [
            new ResponseLoggerHttpInterceptor(),
            new SequenceNumberHttpInterceptor(),
            new TimestampHttpInterceptor(new DateTimeProvider()),
            new RequestLoggerHttpInterceptor(),
            new ResponseTimeHttpInterceptor(new PerformanceTimestampProvider())
        ];
        return new FetchHttpClient(
            'http://localhost:3000/vault',
            [new JsonResponseBodyParser(), new TextResponseBodyParser()],
            httpInterceptors
        );
    }
});
