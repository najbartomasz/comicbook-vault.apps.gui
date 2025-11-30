import { describe, expect, page, setupComponent, test } from '@testing/unit';

import { AppComponent } from './app.component';

describe(AppComponent, () => {
    test('should display toolbar in header', async () => {
        // Given
        await setupComponent(AppComponent);

        // When, Then
        expect(page.getByRole('banner')).toBeVisible();
        expect(page.getByRole('banner').getByText('ComicBook Vault')).toBeVisible();
    });

    test('should display router outlet in main', async () => {
        // Given
        await setupComponent(AppComponent);

        // When, Then
        expect(page.getByRole('main').getByTestId('router-outlet')).toBeInTheDocument();
    });
});
