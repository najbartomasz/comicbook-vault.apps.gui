import { type HttpRequest } from '../../http-request.interface';
import { HttpMethod } from '../../method';

import { SequenceNumberHttpInterceptor } from './sequence-number.http-interceptor';

describe(SequenceNumberHttpInterceptor, () => {
    test('should add sequence number to request metadata', () => {
        // Given
        const interceptor = new SequenceNumberHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 1
            }
        });
    });

    test('should increment sequence number on each request', () => {
        // Given
        const interceptor = new SequenceNumberHttpInterceptor();
        const request1Stub: HttpRequest = {
            url: 'http://example.com/api/1',
            method: HttpMethod.Get
        };
        const request2Stub: HttpRequest = {
            url: 'http://example.com/api/2',
            method: HttpMethod.Get
        };
        const request3Stub: HttpRequest = {
            url: 'http://example.com/api/3',
            method: HttpMethod.Get
        };

        // When
        const result1 = interceptor.interceptRequest(request1Stub);
        const result2 = interceptor.interceptRequest(request2Stub);
        const result3 = interceptor.interceptRequest(request3Stub);

        // Then
        expect(result1.metadata?.sequenceNumber).toBe(1);
        expect(result2.metadata?.sequenceNumber).toBe(2);
        expect(result3.metadata?.sequenceNumber).toBe(3);
    });

    test('should override existing sequence number in metadata', () => {
        // Given
        const interceptor = new SequenceNumberHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 999
            }
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result.metadata).toStrictEqual({
            sequenceNumber: 1
        });
    });

    test('should preserve existing metadata while adding sequence number', () => {
        // Given
        const interceptor = new SequenceNumberHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                timestamp: 1234567890
            }
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result.metadata).toStrictEqual({
            timestamp: 1234567890,
            sequenceNumber: 1
        });
    });
});
