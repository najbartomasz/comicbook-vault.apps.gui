import { type HttpRequest } from '../http-request.interface';
import { type HttpResponse } from '../http-response.interface';

export interface HttpResponseInterceptor {
    interceptResponse(response: HttpResponse, request: HttpRequest): HttpResponse;
}
