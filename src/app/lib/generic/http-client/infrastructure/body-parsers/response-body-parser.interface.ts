export interface ResponseBodyParser {
    parse(response: Response): Promise<unknown>;
}
