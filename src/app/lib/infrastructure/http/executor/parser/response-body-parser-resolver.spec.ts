import { ResponseBodyParserResolver } from './response-body-parser-resolver';
import { type ResponseBodyParser } from './response-body-parser.interface';

describe(ResponseBodyParserResolver, () => {
    test('should resolve parser that can parse the content-type', () => {
        // Given
        const jsonParser: ResponseBodyParser = {
            canParse: (contentType: string) => contentType.includes('application/json'),
            parse: async (response: Response) => response.json()
        };
        const resolver = new ResponseBodyParserResolver([jsonParser]);

        // When
        const result = resolver.resolve('application/json');

        // Then
        expect(result).toBe(jsonParser);
    });

    test('should resolve first matching parser when multiple parsers can parse the content-type', () => {
        // Given
        const firstParser: ResponseBodyParser = {
            canParse: () => true,
            parse: async () => 'first'
        };
        const secondParser: ResponseBodyParser = {
            canParse: () => true,
            parse: async () => 'second'
        };
        const resolver = new ResponseBodyParserResolver([firstParser, secondParser]);

        // When
        const result = resolver.resolve('application/json');

        // Then
        expect(result).toBe(firstParser);
    });

    test('should resolve default text parser when no parser can parse the content-type', async () => {
        // Given
        const jsonParser: ResponseBodyParser = {
            canParse: (contentType: string) => contentType.includes('application/json'),
            parse: async (response: Response) => response.json()
        };
        const resolver = new ResponseBodyParserResolver([jsonParser]);

        // When
        const result = resolver.resolve('application/xml');

        // Then
        await expect(result.parse(new Response('plain text'))).resolves.toBe('plain text');
    });

    test('should resolve default text parser when content-type is empty', async () => {
        // Given
        const jsonParser: ResponseBodyParser = {
            canParse: (contentType: string) => contentType.includes('application/json'),
            parse: async (response: Response) => response.json()
        };
        const resolver = new ResponseBodyParserResolver([jsonParser]);

        // When
        const result = resolver.resolve('');

        // Then
        await expect(result.parse(new Response('fallback text'))).resolves.toBe('fallback text');
    });

    test('should resolve default text parser when no parsers are provided', async () => {
        // Given
        const resolver = new ResponseBodyParserResolver([]);

        // When
        const result = resolver.resolve('application/json');

        // Then
        await expect(result.parse(new Response('text content'))).resolves.toBe('text content');
    });
});
