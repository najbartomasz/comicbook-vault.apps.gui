import { stubResponse } from '@testing/unit/http';

import { TextPlainResponseBodyParser } from './text-plain.response-body-parser';

describe(TextPlainResponseBodyParser, () => {
    test('should parse text/plain content', async () => {
        // Given
        const textBodyParser = new TextPlainResponseBodyParser();

        // When
        const result = await textBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: 'Hello, World!',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        );

        // Then
        expect(result).toBe('Hello, World!');
    });

    test('should parse text/plain with charset', async () => {
        // Given
        const testBodyParser = new TextPlainResponseBodyParser();

        // When
        const result = await testBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: 'Hello, World!',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
            })
        );

        // Then
        expect(result).toBe('Hello, World!');
    });

    test('should parse when content-type is empty', async () => {
        // Given
        const textBodyParser = new TextPlainResponseBodyParser();

        // When
        const result = await textBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: 'text',
                status: 200,
                statusText: 'OK',
                headers: new Headers()
            })
        );

        // Then
        expect(result).toBe('text');
    });

    test('should return undefined when content-type is not text/plain', async () => {
        // Given
        const textBodyParser = new TextPlainResponseBodyParser();

        // When
        const result = await textBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: { key: 'value' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        );

        // Then
        expect(result).toBeUndefined();
    });
});
