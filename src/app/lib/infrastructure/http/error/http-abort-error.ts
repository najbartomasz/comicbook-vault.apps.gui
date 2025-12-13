export class HttpAbortError extends Error {
    public override readonly name = 'HttpAbortError';
    public readonly url: string;

    public constructor(response: { url: string }) {
        super(`HTTP Request Aborted (URL: ${response.url})`);
        this.url = response.url;
        Object.setPrototypeOf(this, HttpAbortError.prototype);
    }
}
