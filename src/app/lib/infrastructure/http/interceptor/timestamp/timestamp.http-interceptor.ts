import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpRequestInterceptor } from '../http-request-interceptor.interface';
import { type HttpResponseInterceptor } from '../http-response-interceptor.interface';

export class TimestampHttpInterceptor implements HttpRequestInterceptor, HttpResponseInterceptor {
    public interceptRequest(request: HttpRequest): HttpRequest {
        return {
            ...request,
            metadata: {
                ...request.metadata,
                timestamp: Date.now()
            }
        };
    }

    public interceptResponse(response: HttpResponse): HttpResponse {
        return {
            ...response,
            metadata: {
                ...response.metadata,
                timestamp: Date.now()
            }
        };
    }
}

