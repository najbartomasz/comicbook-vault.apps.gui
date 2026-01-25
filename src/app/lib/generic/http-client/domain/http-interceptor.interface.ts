import { type HttpInterceptorNext } from './http-interceptor-next.type';
import { type HttpRequest } from './http-request.interface';
import { type HttpResponse } from './http-response.interface';

export interface HttpInterceptor {
    intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse>;
}
