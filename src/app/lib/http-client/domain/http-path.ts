export class HttpPath {
    readonly #value: string;

    private constructor(value: string) {
        this.#value = value;
    }

    public static create(value: string): HttpPath {
        if (!value.startsWith('/')) {
            throw new Error(`Invalid HTTP path: must start with '/' but got '${value}'`);
        }
        if (value.includes('//')) {
            throw new Error(`Invalid HTTP path: contains double slashes '${value}'`);
        }
        if (value.length > 1 && value.endsWith('/')) {
            throw new Error(`Invalid HTTP path: must not end with '/' but got '${value}'`);
        }
        return new HttpPath(value);
    }

    public toString(): string {
        return this.#value;
    }
}
