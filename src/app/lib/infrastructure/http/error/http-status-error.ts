export class HttpStatusError extends Error {
    public override readonly name = 'HttpStatusError';
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;
    public get body(): unknown {
        return structuredClone(this.#body);
    }

    readonly #body?: unknown;

    public constructor(response: { url: string; status: number; statusText: string; body?: unknown }, options?: ErrorOptions) {
        super(`HTTP Status Error ${response.status}: ${response.statusText} (URL: ${response.url})`, options);
        this.url = response.url;
        this.status = response.status;
        this.statusText = response.statusText;
        this.#body = structuredClone(response.body);
        Object.setPrototypeOf(this, HttpStatusError.prototype);
    }
}
