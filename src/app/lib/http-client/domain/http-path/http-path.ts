import { HttpPathError } from './http-path-error';

export class HttpPath {
    readonly #value: string;

    private constructor(value: string) {
        this.#value = value;
    }

    public static create(value: string): HttpPath {
        if (!value.startsWith('/')) {
            throw new HttpPathError(`Invalid HTTP path: must start with '/' but got '${value}'`, value);
        }
        if (value.includes('//')) {
            throw new HttpPathError(`Invalid HTTP path: contains double slashes '${value}'`, value);
        }
        if (value.length > 1 && value.endsWith('/')) {
            throw new HttpPathError(`Invalid HTTP path: must not end with '/' but got '${value}'`, value);
        }
        return new HttpPath(value);
    }

    public toString(): string {
        return this.#value;
    }
}
