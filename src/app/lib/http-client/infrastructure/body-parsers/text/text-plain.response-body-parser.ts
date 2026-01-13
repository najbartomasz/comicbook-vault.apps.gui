import { type ResponseBodyParser } from '../response-body-parser.interface';

export class TextPlainResponseBodyParser implements ResponseBodyParser {
    public canParse(contentType: string): boolean {
        return contentType.includes('text/plain') || contentType === '';
    }

    public async parse(response: Response): Promise<string> {
        return response.text();
    }
}
