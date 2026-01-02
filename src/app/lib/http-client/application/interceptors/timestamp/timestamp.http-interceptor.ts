import { type CurrentDateTimeProvider } from '@lib/date-time/domain';

import { type HttpRequest, type HttpResponse } from '../../../domain';
import { type HttpInterceptorNext } from '../http-interceptor-next.type';
import { type HttpInterceptor } from '../http-interceptor.interface';

export class TimestampHttpInterceptor implements HttpInterceptor {
    readonly #dateTimeProvider: CurrentDateTimeProvider;

    public constructor(dateTimeProvider: CurrentDateTimeProvider) {
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
                timestamp: this.#dateTimeProvider.now()
            }
        };
    }

    #interceptResponse(response: HttpResponse): HttpResponse {
        return {
            ...response,
            metadata: {
                ...response.metadata,
                timestamp: this.#dateTimeProvider.now()
            }
        };
    }
}
