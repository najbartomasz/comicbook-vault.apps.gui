import { type DateTimeProvider, DateTime } from '../domain';

export class SystemDateTime implements DateTimeProvider {
    public now(): DateTime {
        return DateTime.now();
    }
}
