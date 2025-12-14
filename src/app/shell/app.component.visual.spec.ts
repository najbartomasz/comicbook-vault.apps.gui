import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { page } from 'vitest/browser';

import { setupComponent } from '@testing/unit';

import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { config } from './app.config.server';

describe(AppComponent, () => {
    test('should display dashboard page by default', async () => {
        // Given
        await setupComponent(AppComponent, {
            providers: [
                ...appConfig.providers,
                ...config.providers
            ]
        });

        // When, Then
        await expect(page.getByRole('document')).toMatchScreenshot();
    });

    test('should redirect to dashboard when navigating to unknown route', async () => {
        // Given
        await setupComponent(AppComponent, {
            providers: [
                ...appConfig.providers,
                ...config.providers
            ]
        });
        const router = TestBed.inject(Router);

        // When
        await router.navigateByUrl('/some/unknown/route');

        // Then
        await expect(page.getByRole('document')).toMatchScreenshot();
    });
});
