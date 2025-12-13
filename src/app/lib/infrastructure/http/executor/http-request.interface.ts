import { type HttpMethod } from '../method/http-method';

export interface HttpRequest {
    readonly url: string;
    readonly method: HttpMethod;
    readonly signal?: AbortSignal;
}
