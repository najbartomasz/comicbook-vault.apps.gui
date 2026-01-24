import { HttpStatus } from './http-status';

describe('HttpStatus', () => {
    test('should have OK status code defined as 200', () => {
        // Then
        expect(HttpStatus.OK).toBe(200);
    });

    test('should have NoContent status code defined as 204', () => {
        // Then
        expect(HttpStatus.NoContent).toBe(204);
    });
});
