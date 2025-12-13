import { vi } from 'vitest';

export { describe, expect, test } from 'vitest';
export { when } from 'vitest-when';
export { page } from 'vitest/browser';
export const {
    fn,
    spyOn,
    useFakeTimers,
    useRealTimers,
    advanceTimersByTimeAsync
} = vi;
