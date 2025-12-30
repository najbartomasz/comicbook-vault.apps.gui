import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpRequestInterceptor } from '../http-request-interceptor.interface';
import { type HttpResponseInterceptor } from '../http-response-interceptor.interface';

export class LoggerHttpInterceptor implements HttpRequestInterceptor, HttpResponseInterceptor {
    public interceptRequest(request: HttpRequest): HttpRequest {
        // eslint-disable-next-line no-console
        console.info('[HTTP Request]', { method: request.method, url: request.url });
        return request;
    }

    public interceptResponse(response: HttpResponse): HttpResponse {
        // eslint-disable-next-line no-console
        console.info('[HTTP Response]', { url: response.url, status: response.status, statusText: response.statusText });
        return response;
    }
}
