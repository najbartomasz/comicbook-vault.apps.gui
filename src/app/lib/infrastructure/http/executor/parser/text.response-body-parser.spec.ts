import { describe, expect, test } from '@testing/unit';

import { TextResponseBodyParser } from './text.response-body-parser';

describe(TextResponseBodyParser, () => {
    test('should return true when content-type is text/plain', () => {
        // Given
        const parser = new TextResponseBodyParser();

        // When
        const result = parser.canParse('text/plain');

        // Then
        expect(result).toBe(true);
    });

    test('should return true when content-type is text/plain with charset', () => {
        // Given
        const parser = new TextResponseBodyParser();

        // When
        const result = parser.canParse('text/plain; charset=utf-8');

        // Then
        expect(result).toBe(true);
    });

    test('should return true when content-type is empty', () => {
        // Given
        const parser = new TextResponseBodyParser();

        // When
        const result = parser.canParse('');

        // Then
        expect(result).toBe(true);
    });

    test('should return false when content-type is application/json', () => {
        // Given
        const parser = new TextResponseBodyParser();

        // When
        const result = parser.canParse('application/json');

        // Then
        expect(result).toBe(false);
    });

    test('should parse text response body', async () => {
        // Given
        const parser = new TextResponseBodyParser();

        // When
        const result = await parser.parse(new Response('Hello, World!'));

        // Then
        expect(result).toBe('Hello, World!');
    });

    test('should parse empty text response body', async () => {
        // Given
        const parser = new TextResponseBodyParser();

        // When
        const result = await parser.parse(new Response(''));

        // Then
        expect(result).toBe('');
    });

    test('should parse multiline text response body', async () => {
        // Given
        const parser = new TextResponseBodyParser();

        // When
        const result = await parser.parse(new Response('Line 1\nLine 2\nLine 3'));

        // Then
        expect(result).toBe('Line 1\nLine 2\nLine 3');
    });
});
