import { type HttpRequest } from './http-request.interface';
import { type HttpResponse } from './http-response.interface';

export interface HttpRequestExecutor {
    execute(request: HttpRequest): Promise<HttpResponse>;
}
