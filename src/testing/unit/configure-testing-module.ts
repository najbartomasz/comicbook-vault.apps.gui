import type { Provider } from '@angular/core';
import type { TestBed, TestModuleMetadata } from '@angular/core/testing';

export const configureTestingModule = (testBed: TestBed, moduleDef?: TestModuleMetadata): void => {
    const { providers, ...moduleMetadata } = moduleDef ?? { providers: [] };
    testBed.configureTestingModule({
        ...moduleMetadata,
        providers: [
            ...(providers ?? []) as Provider[]
        ]
    });
};
