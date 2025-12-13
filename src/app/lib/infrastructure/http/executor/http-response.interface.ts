export interface HttpResponse {
    readonly status: number;
    readonly statusText: string;
    readonly url: string;
    readonly body: unknown;
}
