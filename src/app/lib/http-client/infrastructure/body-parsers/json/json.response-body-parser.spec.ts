import { JsonResponseBodyParser } from './json.response-body-parser';

describe(JsonResponseBodyParser, () => {
    test('should parse application/json content', async () => {
        // Given
        const parser = new JsonResponseBodyParser();
        const response = new Response(JSON.stringify({ key: 'value' }), {
            headers: { 'Content-Type': 'application/json' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toStrictEqual({ key: 'value' });
    });

    test('should parse application/json with charset', async () => {
        // Given
        const parser = new JsonResponseBodyParser();
        const response = new Response(JSON.stringify({ key: 'value' }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toStrictEqual({ key: 'value' });
    });

    test('should return undefined when content-type is not application/json', async () => {
        // Given
        const parser = new JsonResponseBodyParser();
        const response = new Response('text', {
            headers: { 'Content-Type': 'text/plain' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBeUndefined();
    });

    test('should return undefined when content-type is empty', async () => {
        // Given
        const parser = new JsonResponseBodyParser();
        const response = new Response('text');

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toBeUndefined();
    });

    test('should parse JSON response body', async () => {
        // Given
        const parser = new JsonResponseBodyParser();
        const response = new Response(JSON.stringify({ key: 'value' }), {
            headers: { 'Content-Type': 'application/json' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toStrictEqual({ key: 'value' });
    });

    test('should parse JSON array response body', async () => {
        // Given
        const parser = new JsonResponseBodyParser();
        const response = new Response(JSON.stringify([1, 2, 3]), {
            headers: { 'Content-Type': 'application/json' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toStrictEqual([1, 2, 3]);
    });

    test('should parse nested JSON response body', async () => {
        // Given
        const parser = new JsonResponseBodyParser();
        const response = new Response(JSON.stringify({ nested: { data: { value: 123 } } }), {
            headers: { 'Content-Type': 'application/json' }
        });

        // When
        const result = await parser.parse(response);

        // Then
        expect(result).toStrictEqual({ nested: { data: { value: 123 } } });
    });
});
