import { type HttpInterceptorNext } from '../../http-interceptor-next.type';
import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpInterceptor } from '../http-interceptor.interface';

type HttpRequestWithSequenceNumber = HttpRequest & {
    metadata: HttpRequest['metadata'] & {
        sequenceNumber: number;
    };
};

export class SequenceNumberHttpInterceptor implements HttpInterceptor {
    #sequenceNumber = 0;

    public async intercept(request: HttpRequest, next: HttpInterceptorNext): Promise<HttpResponse> {
        const requestWithSequence = this.#interceptRequest(request);
        const response = await next(requestWithSequence);
        return this.#interceptResponse(response, requestWithSequence.metadata.sequenceNumber);
    }

    #interceptRequest(request: HttpRequest): HttpRequestWithSequenceNumber {
        this.#sequenceNumber++;
        return {
            ...request,
            metadata: {
                ...request.metadata,
                sequenceNumber: this.#sequenceNumber
            }
        };
    }

    #interceptResponse(response: HttpResponse, sequenceNumber: number): HttpResponse {
        return {
            ...response,
            metadata: {
                ...response.metadata,
                sequenceNumber: sequenceNumber
            }
        };
    }
}
