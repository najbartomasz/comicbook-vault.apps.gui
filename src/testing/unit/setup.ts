import type { Provider, Type } from '@angular/core';
import type { TestBed, TestModuleMetadata } from '@angular/core/testing';
import type { RenderComponentOptions } from '@testing-library/angular';
import { render } from '@testing-library/angular';


const configureTestingModule = (testBed: TestBed, moduleDef?: TestModuleMetadata) => {
    const { providers, ...moduleMetadata } = moduleDef ?? { providers: [] };
    testBed.configureTestingModule({
        ...moduleMetadata,
        providers: [
            ...(providers ?? []) as Provider[]
        ]
    });
};

export const setupComponent = async <ComponentType>(component: Type<ComponentType>, options?: RenderComponentOptions<ComponentType>) => {
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
