import { type CurrentDateTimeProvider } from '@lib/date-time/domain';

import { HttpMethod, type HttpRequest, type HttpResponse } from '../../../domain';
import { type HttpInterceptorNext } from '../http-interceptor-next.type';

import { TimestampHttpInterceptor } from './timestamp.http-interceptor';

describe(TimestampHttpInterceptor, () => {
    test('should add timestamp to request and response metadata', async () => {
        // Given
        const dateTimeProviderStub: CurrentDateTimeProvider = {
            now: vi.fn<CurrentDateTimeProvider['now']>()
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1100)
        };
        const interceptor = new TimestampHttpInterceptor(dateTimeProviderStub);
        const requestStub: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get
        };
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: { data: 'test' }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);

        // When
        const result = await interceptor.intercept(requestStub, nextMock);

        // Then
        expect(nextMock).toHaveBeenCalledExactlyOnceWith({
            ...requestStub,
            metadata: {
                timestamp: 1000
            }
        });
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: { data: 'test' },
            metadata: {
                timestamp: 1100
            }
        });
    });

    test('should preserve existing metadata while adding timestamp', async () => {
        // Given
        const dateTimeProviderStub: CurrentDateTimeProvider = {
            now: vi.fn<CurrentDateTimeProvider['now']>()
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1100)
        };
        const interceptor = new TimestampHttpInterceptor(dateTimeProviderStub);
        const requestStub: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 42
            }
        };
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: {},
            metadata: {
                responseTimeMs: 100.25
            }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);

        // When
        const result = await interceptor.intercept(requestStub, nextMock);

        // Then
        expect(nextMock).toHaveBeenCalledExactlyOnceWith({
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 42,
                timestamp: 1000
            }
        });
        expect(result.metadata).toStrictEqual({
            responseTimeMs: 100.25,
            timestamp: 1100
        });
    });
});
