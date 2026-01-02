import { type HttpInterceptorNext } from '../../http-interceptor-next.type';
import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpInterceptor } from '../http-interceptor.interface';

export class ResponseLoggerHttpInterceptor implements HttpInterceptor {
    public async intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse> {
        const response = await next(request);
        return this.#interceptResponse(response);
    }

    #interceptResponse(response: HttpResponse): HttpResponse {
        const { sequenceNumber, timestamp, responseTimeMs } = response.metadata ?? {};
        const responseMetadata = {
            ...sequenceNumber !== undefined && { sequenceNumber },
            ...timestamp !== undefined && { timestamp },
            ...responseTimeMs !== undefined && { responseTimeMs }
        };
        // eslint-disable-next-line no-console
        console.info('[HTTP Response]', {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            ...responseMetadata
        });
        return response;
    }
}
