import { TextPlainResponseBodyParser } from './text-plain.response-body-parser';

describe(TextPlainResponseBodyParser, () => {
    test('should parse text/plain content', async () => {
        // Given
        const parser = new TextPlainResponseBodyParser();
        const response = new Response('Hello, World!', {
            headers: { 'Content-Type': 'text/plain' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBe('Hello, World!');
    });

    test('should parse text/plain with charset', async () => {
        // Given
        const parser = new TextPlainResponseBodyParser();
        const response = new Response('Hello, World!', {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBe('Hello, World!');
    });

    test('should return undefined when content-type is not text/plain', async () => {
        // Given
        const parser = new TextPlainResponseBodyParser();
        const response = new Response(JSON.stringify({ key: 'value' }), {
            headers: { 'Content-Type': 'application/json' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBeUndefined();
    });

    test('should parse when content-type is empty', async () => {
        // Given
        const parser = new TextPlainResponseBodyParser();
        const response = new Response('text');

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBe('text');
    });

    test('should parse text response body', async () => {
        // Given
        const parser = new TextPlainResponseBodyParser();
        const response = new Response('Hello, World!', {
            headers: { 'Content-Type': 'text/plain' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBe('Hello, World!');
    });

    test('should parse empty text response body', async () => {
        // Given
        const parser = new TextPlainResponseBodyParser();
        const response = new Response('', {
            headers: { 'Content-Type': 'text/plain' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBe('');
    });

    test('should parse multiline text response body', async () => {
        // Given
        const parser = new TextPlainResponseBodyParser();
        const response = new Response('Line 1\nLine 2\nLine 3', {
            headers: { 'Content-Type': 'text/plain' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBe('Line 1\nLine 2\nLine 3');
    });
});
