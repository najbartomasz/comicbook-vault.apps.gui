import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe(AppComponent, () => {
    const setup = async () => TestBed.configureTestingModule({
        imports: [AppComponent]
    }).compileComponents();

    test('should create the app', async () => {
        // Given
        await setup();

        // When, Then
        expect(TestBed.createComponent(AppComponent).componentInstance).toBeDefined();
    });
});
