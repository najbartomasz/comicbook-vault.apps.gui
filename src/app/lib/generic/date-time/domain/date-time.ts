export class DateTime {
    public get timestamp(): number {
        return this.#timestamp;
    }

    readonly #timestamp: number;

    private constructor(timestamp: number) {
        this.#timestamp = timestamp;
    }

    public static now(): DateTime {
        return new DateTime(Date.now());
    }

    public toIsoString(): string {
        return new Date(this.#timestamp).toISOString();
    }
}
