import { type Type } from '@angular/core';
import { type RenderComponentOptions, render } from '@testing-library/angular';

export const setupComponent = async <C>(component: Type<C>, options?: RenderComponentOptions<C>) => {
    const { providers, ...renderOptions } = options ?? { providers: [] };
    return render(component, {
        ...renderOptions,
        configureTestBed: (testBed) => {
            testBed.configureTestingModule({ providers });
        },
        autoDetectChanges: true
    });
};
