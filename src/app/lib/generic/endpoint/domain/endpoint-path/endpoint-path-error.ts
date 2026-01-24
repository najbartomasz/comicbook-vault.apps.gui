export class EndpointPathError extends Error {
    public override readonly name = 'EndpointPathError';
    public readonly invalidValue: string;

    public constructor(message: string, invalidValue: string, options?: ErrorOptions) {
        super(message, options);
        this.invalidValue = invalidValue;
        Object.setPrototypeOf(this, EndpointPathError.prototype);
    }
}
