import { page } from 'vitest/browser';

import { setupComponent } from '@testing/unit';

import { DashboardPageComponent } from './dashboard-page.component';

describe(DashboardPageComponent, () => {
    test('should create the component', async () => {
        // Given
        await setupComponent(DashboardPageComponent);

        // When, Then
        expect(page.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
    });
});
