import { type ResponseBodyParser } from './response-body-parser.interface';
import { TextResponseBodyParser } from './text.response-body-parser';

export class ResponseBodyParserResolver {
    readonly #defaultParser: ResponseBodyParser = new TextResponseBodyParser();
    readonly #parsers: ResponseBodyParser[];

    public constructor(parsers: ResponseBodyParser[]) {
        this.#parsers = parsers;
    }

    public resolve(contentType: string): ResponseBodyParser {
        return this.#parsers.find((parser) => parser.canParse(contentType)) ?? this.#defaultParser;
    }
}
