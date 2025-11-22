import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe(AppComponent, () => {
    const setup = async () => TestBed.configureTestingModule({
        imports: [AppComponent]
    }).compileComponents();

    test('should create the app', async () => {
        await setup();
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;

        expect(app).toBeDefined();
    });

    test('should render title', async () => {
        await setup();
        const fixture = TestBed.createComponent(AppComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('h1')?.textContent).toContain('Hello, comicbook-vault.apps.gui');
    });
});
