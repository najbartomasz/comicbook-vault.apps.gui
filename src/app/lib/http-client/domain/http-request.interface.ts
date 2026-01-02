import { type HttpMethod } from './method/http-method';

interface HttpRequestMetadata {
    readonly sequenceNumber?: number;
    readonly timestamp?: number;
}

export interface HttpRequest {
    readonly url: string;
    readonly method: HttpMethod;
    readonly body?: unknown;
    readonly signal?: AbortSignal;
    readonly metadata?: HttpRequestMetadata;
}
