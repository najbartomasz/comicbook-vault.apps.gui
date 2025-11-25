import type { Type } from '@angular/core';
import type { RenderComponentOptions } from '@testing-library/angular';
import { render } from '@testing-library/angular';

import { configureTestingModule } from './configure-testing-module';

export const setupComponent = async <ComponentType>(
    component: Type<ComponentType>,
    options?: RenderComponentOptions<ComponentType>
) => {
    const { providers, ...renderOptions } = options ?? { providers: [] };
    const renderResults = await render(component, {
        ...renderOptions,
        configureTestBed: (testBed) => {
            configureTestingModule(testBed, { providers });
        }
    });
    renderResults.fixture.autoDetectChanges();
    return renderResults;
};
