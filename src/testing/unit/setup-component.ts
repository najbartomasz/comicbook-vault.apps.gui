import { type Type } from '@angular/core';
import { type RenderComponentOptions, render } from '@testing-library/angular';

import { configureTestingModule } from './configure-testing-module';

export const setupComponent = async <C>(component: Type<C>, options?: RenderComponentOptions<C>) => {
    const { providers, ...renderOptions } = options ?? { providers: [] };
    return render(component, {
        ...renderOptions,
        configureTestBed: (testBed) => {
            configureTestingModule(testBed, { providers });
        },
        autoDetectChanges: true
    });
};
