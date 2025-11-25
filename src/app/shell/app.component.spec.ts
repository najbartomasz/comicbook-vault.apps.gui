import { describe, expect, setupComponent, test } from '@testing/unit';

import { AppComponent } from './app.component';

describe(AppComponent, () => {
    test('should create the app', async () => {
        // Given
        const { fixture } = await setupComponent(AppComponent);

        // When, Then
        expect(fixture.componentInstance).toBeDefined();
    });
});
