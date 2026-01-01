import { type HttpRequest } from '../../http-request.interface';
import { type HttpRequestInterceptor } from '../http-request-interceptor.interface';

export class SequenceNumberHttpInterceptor implements HttpRequestInterceptor {
    #sequenceNumber = 0;

    public interceptRequest(request: HttpRequest): HttpRequest {
        this.#sequenceNumber++;
        return {
            ...request,
            metadata: {
                ...request.metadata,
                sequenceNumber: this.#sequenceNumber
            }
        };
    }
}
