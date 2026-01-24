import { type ResponseBodyParser } from '../response-body-parser.interface';

export class TextPlainResponseBodyParser implements ResponseBodyParser {
    public async parse(response: Response): Promise<string | undefined> {
        const contentType = response.headers.get('Content-Type');
        if (!contentType?.includes('text/plain') && contentType !== '') {
            return undefined;
        }
        return response.text();
    }
}
