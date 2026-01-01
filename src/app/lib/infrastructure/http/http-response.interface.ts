interface HttpResponseMetadata {
    readonly timestamp?: number;
    readonly responseTimeMs?: number;
}

export interface HttpResponse {
    readonly url: string;
    readonly status: number;
    readonly statusText: string;
    readonly body: unknown;
    readonly metadata?: HttpResponseMetadata;
}
