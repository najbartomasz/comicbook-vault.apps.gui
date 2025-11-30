import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-dashboard-page',
    imports: [],
    templateUrl: './dashboard-page.component.html',
    styleUrl: './dashboard-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DashboardPageComponent { }
