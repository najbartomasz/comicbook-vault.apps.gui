import { HttpUrlError } from './http-url-error';

export class HttpUrl {
    readonly #value: string;

    private constructor(value: string) {
        this.#value = value;
    }

    public static create(url: string): HttpUrl {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            throw new HttpUrlError(`Invalid URL: "${url}". URL must start with 'http://' or 'https://'.`, url);
        }
        return new HttpUrl(url);
    }

    public toString(): string {
        return this.#value;
    }
}
