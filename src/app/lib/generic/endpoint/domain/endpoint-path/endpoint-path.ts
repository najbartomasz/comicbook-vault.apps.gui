import { EndpointPathError } from './endpoint-path-error';

export class EndpointPath {
    readonly #value: string;

    private constructor(value: string) {
        this.#value = value;
    }

    public static create(value: string): EndpointPath {
        if (!value || value.trim().length === 0) {
            throw new EndpointPathError('Endpoint path cannot be empty', value);
        }
        if (!value.startsWith('/')) {
            throw new EndpointPathError(`Invalid endpoint path: must start with '/' but got '${value}'`, value);
        }
        return new EndpointPath(value);
    }

    public toString(): string {
        return this.#value;
    }
}
