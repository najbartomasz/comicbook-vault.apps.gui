import { type HighResolutionTimestampProvider } from 'src/app/lib/core/performance/high-resolution-timestamp-provider.interface';

import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpRequestInterceptor } from '../http-request-interceptor.interface';
import { type HttpResponseInterceptor } from '../http-response-interceptor.interface';

import { RESPONSE_TIME_PRECISION_MS } from './respons-time.constants';

export class ResponseTimeHttpInterceptor implements HttpRequestInterceptor, HttpResponseInterceptor {
    readonly #highResolutionTimestampProvider: HighResolutionTimestampProvider;

    public constructor(highResolutionTimestampProvider: HighResolutionTimestampProvider) {
        this.#highResolutionTimestampProvider = highResolutionTimestampProvider;
    }

    public interceptRequest(request: HttpRequest): HttpRequest {
        return {
            ...request,
            metadata: {
                ...request.metadata,
                highResolutionTimestamp: this.#highResolutionTimestampProvider.now()
            }
        };
    }

    public interceptResponse(response: HttpResponse, request: HttpRequest): HttpResponse {
        const requestHighResolutionTimestamp = request.metadata?.highResolutionTimestamp ?? 0;
        const responseTime = this.#highResolutionTimestampProvider.now() - requestHighResolutionTimestamp;
        return {
            ...response,
            metadata: {
                ...response.metadata,
                responseTimeMs: Number(responseTime.toFixed(RESPONSE_TIME_PRECISION_MS))
            }
        };
    }
}
