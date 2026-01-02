import { type HttpRequest, type HttpResponse } from '../../domain';

export interface HttpRequestExecutor {
    execute(request: HttpRequest): Promise<HttpResponse>;
}
