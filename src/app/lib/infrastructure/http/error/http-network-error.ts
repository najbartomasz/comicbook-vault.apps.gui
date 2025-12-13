export class HttpNetworkError extends Error {
    public override readonly name = 'HttpNetworkError';
    public readonly url: string;
    public readonly description: string;

    public constructor(response: { url: string; description: string }) {
        super(`HTTP Network Error (URL: ${response.url}): ${response.description}`);
        this.url = response.url;
        this.description = response.description;
        Object.setPrototypeOf(this, HttpNetworkError.prototype);
    }
}
