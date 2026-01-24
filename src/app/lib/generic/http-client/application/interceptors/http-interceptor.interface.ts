import { type HttpRequest, type HttpResponse } from '../../domain';

import { type HttpInterceptorNext } from './http-interceptor-next.type';

export interface HttpInterceptor {
    intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse>;
}
