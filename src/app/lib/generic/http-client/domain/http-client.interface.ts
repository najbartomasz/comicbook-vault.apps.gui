import { type HttpPath } from './http-path/http-path';
import { type HttpResponse } from './http-response.interface';

export interface HttpClient {
    get(path: HttpPath, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse>;
}
