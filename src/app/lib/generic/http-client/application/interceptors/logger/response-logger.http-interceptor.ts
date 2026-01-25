import { type HttpInterceptor, type HttpInterceptorNext, type HttpRequest, type HttpResponse } from '../../../domain';

export class ResponseLoggerHttpInterceptor implements HttpInterceptor {
    public async intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse> {
        const response = await next(request);
        return this.#interceptResponse(response, request);
    }

    #interceptResponse(response: HttpResponse, request: HttpRequest): HttpResponse {
        const { sequenceNumber, timestamp, responseTimeMs } = response.metadata ?? {};
        const responseMetadata = {
            ...sequenceNumber !== undefined && { sequenceNumber },
            ...timestamp !== undefined && { timestamp },
            ...responseTimeMs !== undefined && { responseTimeMs }
        };
        // eslint-disable-next-line no-console
        console.info(`[HTTP Response] ${request.method} ${request.url} ${response.status}`, {
            body: response.body,
            ...responseMetadata
        });
        return response;
    }
}
