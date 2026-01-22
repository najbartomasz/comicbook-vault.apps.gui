export class AppConfigError extends Error {
    public override readonly name = 'AppConfigError';
    public readonly invalidValue: unknown;

    public constructor(message: string, invalidValue: unknown, options?: ErrorOptions) {
        super(message, options);
        this.invalidValue = invalidValue;
        Object.setPrototypeOf(this, AppConfigError.prototype);
    }
}
