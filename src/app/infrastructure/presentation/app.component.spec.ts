import { setupComponent } from '@testing/unit';

import { AppComponent } from './app.component';

describe(AppComponent, () => {
    const setup = async () => setupComponent(AppComponent);

    test('should create the app', async () => {
        // Given
        const { fixture } = await setup();

        // When, Then
        expect(fixture.componentInstance).toBeDefined();
    });
});
