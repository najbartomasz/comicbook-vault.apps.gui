export const boundariesElements = [
    {
        type: 'shell',
        pattern: 'src/app/shell/**',
        mode: 'file'
    },
    {
        type: 'lib-domain',
        pattern: 'src/app/lib/**/domain/**',
        mode: 'file'
    },
    {
        type: 'lib-application',
        pattern: 'src/app/lib/**/application/**',
        mode: 'file'
    },
    {
        type: 'lib-infrastructure',
        pattern: 'src/app/lib/**/infrastructure/**',
        mode: 'file'
    },
    {
        type: 'lib-presentation',
        pattern: 'src/app/lib/**/presentation/**',
        mode: 'file'
    },
    {
        type: 'feature-domain',
        pattern: 'src/app/features/*/domain/**',
        mode: 'file',
        capture: ['featureName']
    },
    {
        type: 'feature-application',
        pattern: 'src/app/features/*/application/**',
        mode: 'file',
        capture: ['featureName']
    },
    {
        type: 'feature-infrastructure',
        pattern: 'src/app/features/*/infrastructure/**',
        mode: 'file',
        capture: ['featureName']
    },
    {
        type: 'feature-presentation',
        pattern: 'src/app/features/*/presentation/**',
        mode: 'file',
        capture: ['featureName']
    },
    {
        type: 'testing',
        pattern: 'src/testing/**',
        mode: 'file'
    },
    {
        type: 'app-providers',
        pattern: 'src/app-providers/**',
        mode: 'file'
    }
];
