export class HttpAbortError extends Error {
    public override readonly name = 'HttpAbortError';
    public readonly url: string;

    public constructor(response: { url: string }, options?: ErrorOptions) {
        super(`HTTP Request Aborted (URL: ${response.url})`, options);
        this.url = response.url;
        Object.setPrototypeOf(this, HttpAbortError.prototype);
    }
}
