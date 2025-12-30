import { type HttpRequestMetadata } from './http-request-metadata.interface';
import { type HttpMethod } from './method/http-method';

export interface HttpRequest {
    readonly url: string;
    readonly method: HttpMethod;
    readonly signal?: AbortSignal;
    readonly metadata?: HttpRequestMetadata;
}
