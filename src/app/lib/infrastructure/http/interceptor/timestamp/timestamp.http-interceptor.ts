import { type CurrentDateTimeProvider } from '@lib/core/date-time';

import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpRequestInterceptor } from '../http-request-interceptor.interface';
import { type HttpResponseInterceptor } from '../http-response-interceptor.interface';

export class TimestampHttpInterceptor implements HttpRequestInterceptor, HttpResponseInterceptor {
    readonly #dateTimeProvider: CurrentDateTimeProvider;

    public constructor(dateTimeProvider: CurrentDateTimeProvider) {
        this.#dateTimeProvider = dateTimeProvider;
    }

    public interceptRequest(request: HttpRequest): HttpRequest {
        return {
            ...request,
            metadata: {
                ...request.metadata,
                timestamp: this.#dateTimeProvider.now()
            }
        };
    }

    public interceptResponse(response: HttpResponse): HttpResponse {
        return {
            ...response,
            metadata: {
                ...response.metadata,
                timestamp: this.#dateTimeProvider.now()
            }
        };
    }
}

