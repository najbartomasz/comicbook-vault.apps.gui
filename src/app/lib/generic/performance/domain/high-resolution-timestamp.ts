export class HighResolutionTimestamp {
    public get value(): number {
        return this.#value;
    }

    readonly #value: number;

    private constructor(value: number) {
        this.#value = value;
    }

    public static create(value: number): HighResolutionTimestamp {
        return new HighResolutionTimestamp(value);
    }

    public durationSince(other: HighResolutionTimestamp): number {
        return this.#value - other.#value;
    }
}
