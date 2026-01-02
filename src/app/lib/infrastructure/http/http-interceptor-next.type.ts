import { type HttpRequest } from './http-request.interface';
import { type HttpResponse } from './http-response.interface';

export type HttpInterceptorNext = (request: HttpRequest) => Promise<HttpResponse>;
