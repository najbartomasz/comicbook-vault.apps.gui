import { type HttpRequestInterceptor } from './interceptor/http-request-interceptor.interface';
import { type HttpResponseInterceptor } from './interceptor/http-response-interceptor.interface';

export type HttpInterceptor =
    | HttpRequestInterceptor
    | HttpResponseInterceptor
    | (HttpRequestInterceptor & HttpResponseInterceptor);
