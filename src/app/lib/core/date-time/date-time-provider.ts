import { type CurrentDateTimeProvider } from './current-date-time-provider.interface';

export class DateTimeProvider implements CurrentDateTimeProvider {
    public now(): number {
        return Date.now();
    }
}
