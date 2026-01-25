import { type HighResolutionTimestamp, type HighResolutionTimestampProvider } from '@lib/generic/performance/domain';

import { type HttpInterceptor, type HttpInterceptorNext, type HttpRequest, type HttpResponse } from '../../../domain';

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

    #interceptResponse(response: HttpResponse, highResolutionTimestamp: HighResolutionTimestamp): HttpResponse {
        const responseTime = this.#highResolutionTimestampProvider.now().durationSince(highResolutionTimestamp);
        return {
            ...response,
            metadata: {
                ...response.metadata,
                responseTimeMs: Number(responseTime.toFixed(RESPONSE_TIME_PRECISION_MS))
            }
        };
    }
}
