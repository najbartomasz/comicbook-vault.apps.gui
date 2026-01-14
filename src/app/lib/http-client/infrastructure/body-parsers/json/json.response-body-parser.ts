import { type ResponseBodyParser } from '../response-body-parser.interface';

export class JsonResponseBodyParser implements ResponseBodyParser {
    public async parse(response: Response): Promise<unknown> {
        const contentType = response.headers.get('Content-Type');
        if (!contentType?.includes('application/json')) {
            return undefined;
        }
        return response.json();
    }
}
