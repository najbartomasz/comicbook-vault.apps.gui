import { describe, expect, test } from '@testing/unit';

import { JsonResponseBodyParser } from './json.response-body-parser';

describe(JsonResponseBodyParser, () => {
    test('should return true when content-type is application/json', () => {
        // Given
        const parser = new JsonResponseBodyParser();

        // When
        const result = parser.canParse('application/json');

        // Then
        expect(result).toBe(true);
    });

    test('should return true when content-type is application/json with charset', () => {
        // Given
        const parser = new JsonResponseBodyParser();

        // When
        const result = parser.canParse('application/json; charset=utf-8');

        // Then
        expect(result).toBe(true);
    });

    test('should return false when content-type is text/plain', () => {
        // Given
        const parser = new JsonResponseBodyParser();

        // When
        const result = parser.canParse('text/plain');

        // Then
        expect(result).toBe(false);
    });

    test('should return false when content-type is empty', () => {
        // Given
        const parser = new JsonResponseBodyParser();

        // When
        const result = parser.canParse('');

        // Then
        expect(result).toBe(false);
    });

    test('should parse JSON response body', async () => {
        // Given
        const parser = new JsonResponseBodyParser();

        // When
        const result = await parser.parse(new Response(JSON.stringify({ key: 'value' })));

        // Then
        expect(result).toEqual({ key: 'value' });
    });

    test('should parse JSON array response body', async () => {
        // Given
        const parser = new JsonResponseBodyParser();

        // When
        const result = await parser.parse(new Response(JSON.stringify([1, 2, 3])));

        // Then
        expect(result).toEqual([1, 2, 3]);
    });

    test('should parse nested JSON response body', async () => {
        // Given
        const parser = new JsonResponseBodyParser();

        // When
        const result = await parser.parse(new Response(JSON.stringify({ nested: { data: { value: 123 } } })));

        // Then
        expect(result).toEqual({ nested: { data: { value: 123 } } });
    });
});
