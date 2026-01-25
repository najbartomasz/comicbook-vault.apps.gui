import { type DateTimeProvider } from '@lib/generic/date-time/domain';

import { type HttpInterceptor, type HttpInterceptorNext, type HttpRequest, type HttpResponse } from '../../../domain';

export class TimestampHttpInterceptor implements HttpInterceptor {
    readonly #dateTimeProvider: DateTimeProvider;

    public constructor(dateTimeProvider: DateTimeProvider) {
        this.#dateTimeProvider = dateTimeProvider;
    }

    public async intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse> {
        const requestWithTimestamp = this.#interceptRequest(request);
        const response = await next(requestWithTimestamp);
        return this.#interceptResponse(response);
    }

    #interceptRequest(request: HttpRequest): HttpRequest {
        return {
            ...request,
            metadata: {
                ...request.metadata,
                timestamp: this.#dateTimeProvider.now().timestamp
            }
        };
    }

    #interceptResponse(response: HttpResponse): HttpResponse {
        return {
            ...response,
            metadata: {
                ...response.metadata,
                timestamp: this.#dateTimeProvider.now().timestamp
            }
        };
    }
}
