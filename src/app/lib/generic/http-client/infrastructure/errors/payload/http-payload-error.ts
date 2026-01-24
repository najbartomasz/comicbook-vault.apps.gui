export class HttpPayloadError extends Error {
    public override readonly name = 'HttpPayloadError';
    public readonly url: string;
    public readonly description: string;

    public constructor(response: { url: string }, options?: ErrorOptions) {
        super(`HTTP Payload Error (URL: ${response.url})`, options);
        this.url = response.url;
        this.description = 'Failed to parse response';
        Object.setPrototypeOf(this, HttpPayloadError.prototype);
    }
}
