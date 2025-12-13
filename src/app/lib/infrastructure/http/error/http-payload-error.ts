export class HttpPayloadError extends Error {
    public override readonly name = 'HttpPayloadError';
    public readonly url: string;
    public readonly description: string;

    public constructor(response: { url: string }) {
        super(`HTTP Payload Error (URL: ${response.url})`);
        this.url = response.url;
        this.description = 'Failed to parse response as JSON';
        Object.setPrototypeOf(this, HttpPayloadError.prototype);
    }
}
