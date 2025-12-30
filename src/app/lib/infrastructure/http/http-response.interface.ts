interface HttpResponseMetadata {
    readonly timestamp?: number;
}

export interface HttpResponse {
    readonly status: number;
    readonly statusText: string;
    readonly url: string;
    readonly body: unknown;
    readonly metadata?: HttpResponseMetadata;
}
