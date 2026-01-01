import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpRequestInterceptor } from '../http-request-interceptor.interface';
import { type HttpResponseInterceptor } from '../http-response-interceptor.interface';

export class LoggerHttpInterceptor implements HttpRequestInterceptor, HttpResponseInterceptor {
    public interceptRequest(request: HttpRequest): HttpRequest {
        this.#log('[HTTP Request]', {
            url: request.url,
            method: request.method,
            ...this.#extractRequestMetadata(request)
        });
        return request;
    }

    public interceptResponse(response: HttpResponse, request: HttpRequest): HttpResponse {
        this.#log('[HTTP Response]', {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            ...request.metadata?.sequenceNumber !== undefined && { sequenceNumber: request.metadata.sequenceNumber },
            ...this.#extractResponseMetadata(response)
        });
        return response;
    }

    #extractRequestMetadata(request: HttpRequest): Record<string, unknown> {
        const { metadata } = request;
        return metadata
            ? {
                ...metadata.sequenceNumber !== undefined && { sequenceNumber: metadata.sequenceNumber },
                ...metadata.timestamp !== undefined && { timestamp: metadata.timestamp },
                ...metadata.highResolutionTimestamp !== undefined && { highResolutionTimestamp: metadata.highResolutionTimestamp }
            }
            : {};
    }

    #extractResponseMetadata(response: HttpResponse): Record<string, unknown> {
        const { metadata } = response;
        return metadata
            ? {
                ...metadata.timestamp !== undefined && { timestamp: metadata.timestamp },
                ...metadata.responseTimeMs !== undefined && { responseTimeMs: metadata.responseTimeMs }
            }
            : {};
    }

    #log(label: string, data: Record<string, unknown>): void {
        // eslint-disable-next-line no-console
        console.info(label, data);
    }
}
