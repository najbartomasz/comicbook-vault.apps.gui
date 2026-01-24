/* eslint-disable no-template-curly-in-string */
export const boundariesRules = {
    'boundaries/no-unknown': 'warn',
    'boundaries/element-types': [
        'error',
        {
            default: 'disallow',
            rules: [
                // Shell can import from lib, features
                {
                    from: 'shell',
                    allow: [
                        'shell',
                        'lib-domain',
                        'lib-application',
                        'lib-infrastructure',
                        'lib-presentation',
                        'feature-domain',
                        'feature-application',
                        'feature-infrastructure',
                        'feature-presentation',
                        'testing'
                    ],
                    message: 'Shell cannot import from app-providers. App-providers should only be imported at application bootstrap level.'
                },
                // app-providers can import from every layer (composition root)
                {
                    from: 'app-providers',
                    allow: [
                        'shell',
                        'lib-domain',
                        'lib-application',
                        'lib-infrastructure',
                        'lib-presentation',
                        'feature-domain',
                        'feature-application',
                        'feature-infrastructure',
                        'feature-presentation',
                        'testing'
                    ]
                },
                // Lib domain
                {
                    from: 'lib-domain',
                    disallow: [
                        'lib-application',
                        'lib-infrastructure',
                        'lib-presentation',
                        'feature-domain',
                        'feature-application',
                        'feature-infrastructure',
                        'feature-presentation',
                        'shell'
                    ],
                    allow: ['lib-domain'],
                    message: 'Domain layer cannot import from infra or presentation layers. Keep domain logic pure and framework-agnostic.'
                },
                // Lib application
                {
                    from: 'lib-application',
                    disallow: [
                        'lib-infrastructure',
                        'lib-presentation',
                        'feature-domain',
                        'feature-application',
                        'feature-infrastructure',
                        'feature-presentation',
                        'shell'
                    ],
                    allow: ['lib-domain', 'lib-application'],
                    message: 'Application layer cannot import from infra or presentation layers. Keep application logic framework-agnostic.'
                },
                // Lib infrastructure
                {
                    from: 'lib-infrastructure',
                    disallow: [
                        'lib-presentation',
                        'feature-domain',
                        'feature-application',
                        'feature-infrastructure',
                        'feature-presentation',
                        'shell'
                    ],
                    allow: [
                        'lib-domain',
                        'lib-application',
                        'lib-infrastructure'
                    ],
                    message: 'Infrastructure layer cannot import from presentation layer. Keep infrastructure framework-agnostic.'
                },
                // Lib presentation
                {
                    from: 'lib-presentation',
                    allow: ['lib-domain', 'lib-application', 'lib-infrastructure', 'lib-presentation']
                },
                // Feature domain
                {
                    from: 'feature-domain',
                    disallow: [
                        'lib-application',
                        'lib-infrastructure',
                        'lib-presentation',
                        'feature-application',
                        'feature-infrastructure',
                        'feature-presentation',
                        'shell'
                    ],
                    allow: [
                        'lib-domain',
                        ['feature-domain', { featureName: '${from.featureName}' }]
                    ],
                    message: 'Domain layer cannot import from infra or presentation layers. Keep domain logic pure and framework-agnostic.'
                },
                // Feature application
                {
                    from: 'feature-application',
                    disallow: [
                        'lib-infrastructure',
                        'lib-presentation',
                        'feature-infrastructure',
                        'feature-presentation',
                        'shell'
                    ],
                    allow: [
                        'lib-domain',
                        'lib-application',
                        ['feature-domain', { featureName: '${from.featureName}' }],
                        ['feature-application', { featureName: '${from.featureName}' }]
                    ],
                    message: 'Application layer cannot import from infra or presentation layers. Keep application logic framework-agnostic.'
                },
                // Feature infrastructure
                {
                    from: 'feature-infrastructure',
                    disallow: ['lib-presentation', 'feature-presentation', 'shell'],
                    allow: [
                        'lib-domain',
                        'lib-application',
                        'lib-infrastructure',
                        ['feature-domain', { featureName: '${from.featureName}' }],
                        ['feature-application', { featureName: '${from.featureName}' }],
                        ['feature-infrastructure', { featureName: '${from.featureName}' }]
                    ],
                    message: 'Infrastructure layer cannot import from presentation layer. Keep infrastructure framework-agnostic.'
                },
                // Feature presentation
                {
                    from: 'feature-presentation',
                    allow: [
                        'lib-domain',
                        'lib-application',
                        'lib-infrastructure',
                        'lib-presentation',
                        ['feature-domain', { featureName: '${from.featureName}' }],
                        ['feature-application', { featureName: '${from.featureName}' }],
                        ['feature-infrastructure', { featureName: '${from.featureName}' }],
                        ['feature-presentation', { featureName: '${from.featureName}' }]
                    ]
                }
            ]
        }
    ],
    'boundaries/entry-point': [
        'error',
        {
            default: 'disallow',
            rules: [
                // Shell can access internal pages
                {
                    target: 'shell',
                    allow: '**'
                },
                // app-providers must export through their index.ts
                {
                    target: 'app-providers',
                    allow: 'index.ts'
                },
                // Feature layers must export through their index.ts
                {
                    target: ['feature-domain', 'feature-application', 'feature-infrastructure', 'feature-presentation'],
                    allow: 'index.ts'
                },
                // Lib layers must export through their index.ts (barrel files only)
                {
                    target: ['lib-domain', 'lib-application', 'lib-infrastructure', 'lib-presentation'],
                    allow: 'index.ts'
                },
                // Testing utilities must be imported through index.ts
                {
                    target: 'testing',
                    allow: '**/index.ts'
                }
            ]
        }
    ],
    'boundaries/external': [
        'error',
        {
            default: 'allow',
            rules: [
                // Domain cannot import Angular
                {
                    from: 'lib-domain',
                    disallow: ['@angular/**'],
                    message: 'Domain layer cannot import Angular. Keep domain logic framework-agnostic.'
                },
                // Application cannot import Angular
                {
                    from: 'lib-application',
                    disallow: ['@angular/**'],
                    message: 'Application layer cannot import Angular. Keep application logic framework-agnostic.'
                },
                // Infrastructure cannot import Angular
                {
                    from: 'lib-infrastructure',
                    disallow: ['@angular/**'],
                    message: 'Infrastructure layer cannot import Angular. Keep infrastructure framework-agnostic.'
                },
                // Feature domain cannot import Angular
                {
                    from: 'feature-domain',
                    disallow: ['@angular/**'],
                    message: 'Feature domain layer cannot import Angular. Keep domain logic framework-agnostic.'
                },
                // Feature application cannot import Angular
                {
                    from: 'feature-application',
                    disallow: ['@angular/**'],
                    message: 'Feature application layer cannot import Angular. Keep application logic framework-agnostic.'
                },
                // Feature infrastructure cannot import Angular
                {
                    from: 'feature-infrastructure',
                    disallow: ['@angular/**'],
                    message: 'Feature infrastructure layer cannot import Angular. Keep infrastructure framework-agnostic.'
                }
            ]
        }
    ]
};
