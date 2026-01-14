import { HttpMethod, type HttpRequest, type HttpResponse } from '../../../domain';
import { type HttpInterceptorNext } from '../http-interceptor-next.type';

import { SequenceNumberHttpInterceptor } from './sequence-number.http-interceptor';

describe(SequenceNumberHttpInterceptor, () => {
    test('should add sequence number to request and response metadata', async () => {
        // Given
        const requestStub: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get
        };
        const responseStub: HttpResponse = {
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);
        const sequenceNumberInterceptor = new SequenceNumberHttpInterceptor();

        // When
        const result = await sequenceNumberInterceptor.intercept(requestStub, nextMock);

        // Then
        expect(nextMock).toHaveBeenCalledExactlyOnceWith({
            ...requestStub,
            metadata: {
                sequenceNumber: 1
            }
        });
        expect(result).toStrictEqual({
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                sequenceNumber: 1
            }
        });
    });

    test('should increment sequence number on each request', async () => {
        // Given
        const request1Stub: HttpRequest = {
            url: 'https://example.com/api/1',
            method: HttpMethod.Get
        };
        const request2Stub: HttpRequest = {
            url: 'https://example.com/api/2',
            method: HttpMethod.Get
        };
        const nextMock = vi.fn<HttpInterceptorNext>()
            .mockResolvedValueOnce({
                url: 'https://example.com/api/1',
                status: 200,
                statusText: 'OK',
                body: { data: 'test1' }
            })
            .mockResolvedValueOnce({
                url: 'https://example.com/api/2',
                status: 200,
                statusText: 'OK',
                body: { data: 'test2' }
            });
        const sequenceNumberInterceptor = new SequenceNumberHttpInterceptor();

        // When
        const result1 = await sequenceNumberInterceptor.intercept(request1Stub, nextMock);
        const result2 = await sequenceNumberInterceptor.intercept(request2Stub, nextMock);

        // Then
        expect(result1.metadata?.sequenceNumber).toBe(1);
        expect(result2.metadata?.sequenceNumber).toBe(2);
    });

    test('should preserve existing metadata while adding sequence number', async () => {
        // Given
        const requestStub: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                timestamp: 1000
            }
        };
        const responseStub: HttpResponse = {
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                timestamp: 1100
            }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);
        const sequenceNumberInterceptor = new SequenceNumberHttpInterceptor();

        // When
        const result = await sequenceNumberInterceptor.intercept(requestStub, nextMock);

        // Then
        expect(nextMock).toHaveBeenCalledExactlyOnceWith({
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 1,
                timestamp: 1000
            }
        });
        expect(result.metadata).toStrictEqual({
            sequenceNumber: 1,
            timestamp: 1100
        });
    });
});
