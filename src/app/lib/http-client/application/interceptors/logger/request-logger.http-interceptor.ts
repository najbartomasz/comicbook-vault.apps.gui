import { type HttpRequest, type HttpResponse } from '../../../domain';
import { type HttpInterceptorNext } from '../http-interceptor-next.type';
import { type HttpInterceptor } from '../http-interceptor.interface';

export class RequestLoggerHttpInterceptor implements HttpInterceptor {
    public async intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse> {
        const interceptedRequest = this.#interceptRequest(request);
        return next(interceptedRequest);
    }

    #interceptRequest(request: HttpRequest): HttpRequest {
        const { sequenceNumber, timestamp } = request.metadata ?? {};
        const requestMetadata = {
            ...sequenceNumber !== undefined && { sequenceNumber },
            ...timestamp !== undefined && { timestamp }
        };
        // eslint-disable-next-line no-console
        console.info(`[HTTP Request] ${request.method} ${request.url}`, {
            body: request.body,
            ...requestMetadata
        });
        return request;
    }
}
