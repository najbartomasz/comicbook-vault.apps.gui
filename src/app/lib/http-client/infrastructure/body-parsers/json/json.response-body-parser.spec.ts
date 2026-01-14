import { stubResponse } from '@testing/unit/http';

import { JsonResponseBodyParser } from './json.response-body-parser';

describe(JsonResponseBodyParser, () => {
    test('should parse application/json content', async () => {
        // Given
        const jsonBodyParser = new JsonResponseBodyParser();

        // When
        const result = await jsonBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: { key: 'value' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        );

        // Then
        expect(result).toStrictEqual({ key: 'value' });
    });

    test('should parse application/json with charset', async () => {
        // Given
        const jsonBodyParser = new JsonResponseBodyParser();

        // When
        const result = await jsonBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: { key: 'value' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
            })
        );

        // Then
        expect(result).toStrictEqual({ key: 'value' });
    });

    test('should return undefined when content-type is not application/json', async () => {
        // Given
        const jsonBodyParser = new JsonResponseBodyParser();

        // When
        const result = await jsonBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: 'text',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        );

        // Then
        expect(result).toBeUndefined();
    });

    test('should return undefined when content-type is empty', async () => {
        // Given
        const jsonBodyParser = new JsonResponseBodyParser();

        // When
        const result = await jsonBodyParser.parse(
            stubResponse({
                url: 'https://example.com/api',
                body: 'text',
                status: 200,
                statusText: 'OK',
                headers: new Headers()
            })
        );

        // Then
        expect(result).toBeUndefined();
    });
});
