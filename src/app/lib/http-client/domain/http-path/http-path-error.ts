export class HttpPathError extends Error {
    public override readonly name = 'HttpPathError';
    public readonly invalidValue: string;

    public constructor(message: string, invalidValue: string, options?: ErrorOptions) {
        super(message, options);
        this.invalidValue = invalidValue;
        Object.setPrototypeOf(this, HttpPathError.prototype);
    }
}
