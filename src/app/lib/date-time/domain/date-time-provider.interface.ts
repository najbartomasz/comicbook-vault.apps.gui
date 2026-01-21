import { type DateTime } from './date-time';

export interface DateTimeProvider {
    now(): DateTime;
}
