import { type HttpRequest } from '../http-request.interface';

export interface HttpRequestInterceptor {
    interceptRequest(request: HttpRequest): HttpRequest;
}
