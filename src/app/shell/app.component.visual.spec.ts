import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { page } from 'vitest/browser';

import { setupComponent } from '@testing/unit';

import { config as appConfigClient } from '../../app.config.client';
import { config as appConfigServer } from '../../app.config.server';

import { AppComponent } from './app.component';

describe(AppComponent, () => {
    test('should display dashboard page by default', async () => {
        // Given
        vi.spyOn(console, 'info').mockImplementation(vi.fn());
        await setupComponent(AppComponent, {
            providers: [
                ...appConfigClient.providers,
                ...appConfigServer.providers
            ]
        });

        // When, Then
        await expect(page.getByRole('document')).toMatchScreenshot();
    });

    test('should redirect to dashboard when navigating to unknown route', async () => {
        // Given
        vi.spyOn(console, 'info').mockImplementation(vi.fn());
        await setupComponent(AppComponent, {
            providers: [
                ...appConfigClient.providers,
                ...appConfigServer.providers
            ]
        });
        const router = TestBed.inject(Router);

        // When
        await router.navigateByUrl('/some/unknown/route');

        // Then
        await expect(page.getByRole('document')).toMatchScreenshot();
    });
});
