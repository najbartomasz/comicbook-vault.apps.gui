import { type HighResolutionTimestampProvider } from 'src/app/lib/core/performance/high-resolution-timestamp-provider.interface';

import { type HttpInterceptorNext } from '../../http-interceptor-next.type';
import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpInterceptor } from '../http-interceptor.interface';

import { RESPONSE_TIME_PRECISION_MS } from './response-time.constants';

export class ResponseTimeHttpInterceptor implements HttpInterceptor {
    readonly #highResolutionTimestampProvider: HighResolutionTimestampProvider;

    public constructor(highResolutionTimestampProvider: HighResolutionTimestampProvider) {
        this.#highResolutionTimestampProvider = highResolutionTimestampProvider;
    }

    public async intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse> {
        const highResolutionTimestamp = this.#highResolutionTimestampProvider.now();
        const response = await next(request);
        return this.#interceptResponse(response, highResolutionTimestamp);
    }

    #interceptResponse(response: HttpResponse, highResolutionTimestamp: number): HttpResponse {
        const responseTime = this.#highResolutionTimestampProvider.now() - highResolutionTimestamp;
        return {
            ...response,
            metadata: {
                ...response.metadata,
                responseTimeMs: Number(responseTime.toFixed(RESPONSE_TIME_PRECISION_MS))
            }
        };
    }
}
