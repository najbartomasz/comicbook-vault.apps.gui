export class HttpUrlError extends Error {
    public override readonly name = 'HttpUrlError';
    public readonly invalidValue: string;

    public constructor(message: string, invalidValue: string, options?: ErrorOptions) {
        super(message, options);
        this.invalidValue = invalidValue;
        Object.setPrototypeOf(this, HttpUrlError.prototype);
    }
}
