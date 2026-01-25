export class DateTime {
    public get timestamp(): number {
        return this.#timestamp;
    }

    readonly #timestamp: number;

    private constructor(timestamp: number) {
        this.#timestamp = timestamp;
    }

    public static create(timestamp: number): DateTime {
        return new DateTime(timestamp);
    }

    public toIsoString(): string {
        return new Date(this.#timestamp).toISOString();
    }
}
