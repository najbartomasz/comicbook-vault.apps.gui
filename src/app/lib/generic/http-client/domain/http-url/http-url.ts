import { HttpUrlError } from './http-url-error';

export class HttpUrl {
    readonly #value: URL;

    private constructor(value: URL) {
        this.#value = value;
    }

    public static create(url: string): HttpUrl {
        let parsedUrl: URL | undefined;
        try {
            parsedUrl = new URL(url);
        } catch {
            throw new HttpUrlError(`Invalid URL: "${url}".`, url);
        }
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            throw new HttpUrlError(`Invalid URL: "${url}". URL must start with 'http://' or 'https://'.`, url);
        }
        return new HttpUrl(parsedUrl);
    }

    public toString(): string {
        return this.#value.toString();
    }
}
