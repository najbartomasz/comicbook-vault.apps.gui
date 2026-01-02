import { type HttpRequest, type HttpResponse } from '../../domain';

export type HttpInterceptorNext = (request: HttpRequest) => Promise<HttpResponse>;
