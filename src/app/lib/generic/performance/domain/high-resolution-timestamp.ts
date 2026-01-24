export class HighResolutionTimestamp {
    public get value(): number {
        return this.#value;
    }

    readonly #value: number;

    private constructor(value: number) {
        this.#value = value;
    }

    public static now(): HighResolutionTimestamp {
        return new HighResolutionTimestamp(performance.now());
    }

    public durationSince(other: HighResolutionTimestamp): number {
        return this.#value - other.#value;
    }
}
