interface ResponseData {
    url: string;
    body?: object | string;
    status: number;
    statusText: string;
    headers?: Headers;
}

const buildResponseBody = (body: object | string | undefined): string | undefined => {
    if (body === undefined) {
        return undefined;
    }
    return typeof body === 'string' ? body : JSON.stringify(body);
};

export const stubResponse = (data: ResponseData): Response => {
    const response = new Response(buildResponseBody(data.body), {
        status: data.status,
        statusText: data.statusText,
        headers: data.headers
    });
    Object.defineProperty(response, 'url', { value: data.url });
    return response;
};
