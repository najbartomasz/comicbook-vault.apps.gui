import { InjectionToken } from '@angular/core';

import { DateTimeProvider } from '@lib/core/date-time';
import { PerformanceTimestampProvider } from '@lib/core/performance';
import { FetchHttpClient, SequenceNumberHttpInterceptor, type HttpClient, type HttpInterceptor } from '@lib/infrastructure/http';
import { FetchHttpRequestExecutor } from '@lib/infrastructure/http/executor';
import { JsonResponseBodyParser, ResponseBodyParserResolver, TextResponseBodyParser } from '@lib/infrastructure/http/executor/parser';
import { LoggerHttpInterceptor, TimestampHttpInterceptor } from '@lib/infrastructure/http/interceptor';
import { ResponseTimeHttpInterceptor } from '@lib/infrastructure/http/interceptor/response-time';

export const VAULT_HTTP_CLIENT_TOKEN = new InjectionToken<HttpClient>('VaultHttpClient', {
    providedIn: 'root',
    factory: () => {
        const bodyParserResolver = new ResponseBodyParserResolver([
            new JsonResponseBodyParser(),
            new TextResponseBodyParser()
        ]);
        const httpInterceptors: HttpInterceptor[] = [
            new ResponseTimeHttpInterceptor(new DateTimeProvider()),
            new SequenceNumberHttpInterceptor(),
            new TimestampHttpInterceptor(new PerformanceTimestampProvider()),
            new LoggerHttpInterceptor()
        ];
        return new FetchHttpClient(
            'http://localhost:3000/vault',
            new FetchHttpRequestExecutor(bodyParserResolver),
            httpInterceptors
        );
    }
});
