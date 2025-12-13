import { type ResponseBodyParser } from './response-body-parser.interface';

export class JsonResponseBodyParser implements ResponseBodyParser {
    public canParse(contentType: string): boolean {
        return contentType.includes('application/json');
    }

    public async parse(response: Response): Promise<unknown> {
        return response.json();
    }
}
