export class HttpUrl {
    readonly #value: string;

    private constructor(value: string) {
        this.#value = value;
    }

    public static create(url: string): HttpUrl {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            throw new Error(`Invalid URL: "${url}". URL must start with 'http://' or 'https://'.`);
        }
        return new HttpUrl(url);
    }

    public toString(): string {
        return this.#value;
    }
}
