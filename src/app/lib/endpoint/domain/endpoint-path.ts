export class EndpointPath {
    readonly #value: string;

    private constructor(value: string) {
        this.#value = value;
    }

    public static create(value: string): EndpointPath {
        if (!value || value.trim().length === 0) {
            throw new Error('Endpoint path cannot be empty');
        }
        if (!value.startsWith('/')) {
            throw new Error(`Invalid endpoint path: must start with '/' but got '${value}'`);
        }
        return new EndpointPath(value);
    }

    public toString(): string {
        return this.#value;
    }
}
