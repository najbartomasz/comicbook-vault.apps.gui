import { HttpMethod } from './http-method';

describe('HttpMethod', () => {
    test('should have Get method defined as GET', () => {
        // Then
        expect(HttpMethod.Get).toBe('GET');
    });
});
