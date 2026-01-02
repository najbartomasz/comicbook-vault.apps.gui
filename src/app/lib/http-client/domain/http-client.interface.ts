import { type HttpResponse } from './http-response.interface';

export interface HttpClient {
    get(url: string, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse>;
}
