export interface ResponseBodyParser {
    canParse(contentType: string): boolean;
    parse(response: Response): Promise<unknown>;
}
