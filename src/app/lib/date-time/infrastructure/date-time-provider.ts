import { type CurrentDateTimeProvider } from '../domain';

export class DateTimeProvider implements CurrentDateTimeProvider {
    public now(): number {
        return Date.now();
    }
}
