export const boundariesRules = {
    'boundaries/no-unknown': 'warn',
    'boundaries/element-types': [
        'error',
        {
            default: 'disallow',
            rules: [
                // Shell can import from lib, features, and api
                {
                    from: 'shell',
                    allow: ['shell', 'api-domain', 'api-application', 'api-infrastructure', 'api-presentation', 'config-domain', 'config-application', 'config-infrastructure', 'config-presentation', 'lib-domain', 'lib-application', 'lib-infrastructure', 'lib-presentation', 'feature-domain', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'testing'],
                    message: 'Shell cannot import from app-providers. App-providers should only be imported at application bootstrap level.'
                },
                // API domain is framework-agnostic (pure TypeScript only)
                {
                    from: 'api-domain',
                    disallow: ['api-application', 'api-infrastructure', 'api-presentation', 'lib-application', 'lib-infrastructure', 'lib-presentation', 'feature-domain', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'api-domain'],
                    message: 'API domain layer cannot import from infrastructure or presentation layers. Keep domain logic pure and framework-agnostic.'
                },
                // API application is framework-agnostic (use cases and orchestration)
                {
                    from: 'api-application',
                    disallow: ['api-infrastructure', 'api-presentation', 'lib-infrastructure', 'lib-presentation', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'lib-application', 'api-domain', 'api-application', 'feature-domain'],
                    message: 'API application layer cannot import from infrastructure or presentation layers. Keep application logic framework-agnostic.'
                },
                // API infrastructure is framework-agnostic (can use application and domain)
                {
                    from: 'api-infrastructure',
                    disallow: ['api-presentation', 'lib-presentation', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'lib-application', 'lib-infrastructure', 'api-domain', 'api-application', 'api-infrastructure', 'feature-domain', 'feature-application'],
                    message: 'API infrastructure layer cannot import from presentation layer. Keep infrastructure framework-agnostic.'
                },
                // API presentation can use Angular and lower layers
                {
                    from: 'api-presentation',
                    allow: ['lib-domain', 'lib-application', 'lib-infrastructure', 'lib-presentation', 'api-domain', 'api-application', 'api-infrastructure', 'api-presentation']
                },
                // Config domain is framework-agnostic (pure TypeScript only)
                {
                    from: 'config-domain',
                    disallow: ['config-application', 'config-infrastructure', 'config-presentation', 'api-application', 'api-infrastructure', 'lib-application', 'lib-infrastructure', 'lib-presentation', 'feature-domain', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'config-domain'],
                    message: 'Config domain layer cannot import from infrastructure or presentation layers. Keep domain logic pure and framework-agnostic.'
                },
                // Config application is framework-agnostic (use cases and orchestration)
                {
                    from: 'config-application',
                    disallow: ['config-infrastructure', 'config-presentation', 'api-infrastructure', 'lib-infrastructure', 'lib-presentation', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'lib-application', 'config-domain', 'config-application', 'api-domain', 'api-application'],
                    message: 'Config application layer cannot import from infrastructure or presentation layers. Keep application logic framework-agnostic.'
                },
                // Config infrastructure is framework-agnostic (can use application and domain)
                {
                    from: 'config-infrastructure',
                    disallow: ['config-presentation', 'lib-presentation', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'lib-application', 'lib-infrastructure', 'config-domain', 'config-infrastructure', 'api-domain', 'api-application', 'api-infrastructure'],
                    message: 'Config infrastructure layer cannot import from presentation layer. Keep infrastructure framework-agnostic.'
                },
                // Config presentation can use Angular and lower layers
                {
                    from: 'config-presentation',
                    allow: ['lib-domain', 'lib-application', 'lib-infrastructure', 'lib-presentation', 'config-domain', 'config-application', 'config-infrastructure', 'config-presentation', 'api-domain', 'api-application', 'api-infrastructure']
                },
                // app-providers can import from every layer (composition root)
                {
                    from: 'app-providers',
                    allow: ['shell', 'api-domain', 'api-application', 'api-infrastructure', 'api-presentation', 'config-domain', 'config-application', 'config-infrastructure', 'config-presentation', 'lib-domain', 'lib-application', 'lib-infrastructure', 'lib-presentation', 'feature-domain', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'testing']
                },
                // Lib domain
                {
                    from: 'lib-domain',
                    disallow: ['lib-application', 'lib-infrastructure', 'lib-presentation', 'feature-domain', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain'],
                    message: 'Domain layer cannot import from infrastructure or presentation layers. Keep domain logic pure and framework-agnostic.'
                },
                // Lib application
                {
                    from: 'lib-application',
                    disallow: ['lib-infrastructure', 'lib-presentation', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'lib-application', 'feature-domain'],
                    message: 'Application layer cannot import from infrastructure or presentation layers. Keep application logic framework-agnostic.'
                },
                // Lib infrastructure
                {
                    from: 'lib-infrastructure',
                    disallow: ['lib-presentation', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: ['lib-domain', 'lib-application', 'lib-infrastructure', 'feature-domain', 'feature-application'],
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
                    disallow: ['lib-application', 'lib-infrastructure', 'lib-presentation', 'feature-application', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: [
                        'lib-domain',
                        ['feature-domain', { featureName: '${from.featureName}' }]
                    ],
                    message: 'Domain layer cannot import from infrastructure or presentation layers. Keep domain logic pure and framework-agnostic.'
                },
                // Feature application
                {
                    from: 'feature-application',
                    disallow: ['lib-infrastructure', 'lib-presentation', 'feature-infrastructure', 'feature-presentation', 'shell'],
                    allow: [
                        'lib-domain',
                        'lib-application',
                        ['feature-domain', { featureName: '${from.featureName}' }],
                        ['feature-application', { featureName: '${from.featureName}' }]
                    ],
                    message: 'Application layer cannot import from infrastructure or presentation layers. Keep application logic framework-agnostic.'
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
                // API layers must export through their index.ts
                {
                    target: ['api-domain', 'api-application', 'api-infrastructure', 'api-presentation'],
                    allow: 'index.ts'
                },
                // Config layers must export through their index.ts
                {
                    target: ['config-domain', 'config-application', 'config-infrastructure', 'config-presentation'],
                    allow: 'index.ts'
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
                },
                // API domain cannot import Angular
                {
                    from: 'api-domain',
                    disallow: ['@angular/**'],
                    message: 'API domain layer cannot import Angular. Keep domain logic framework-agnostic.'
                },
                // API application cannot import Angular
                {
                    from: 'api-application',
                    disallow: ['@angular/**'],
                    message: 'API application layer cannot import Angular. Keep application logic framework-agnostic.'
                },
                // API infrastructure cannot import Angular
                {
                    from: 'api-infrastructure',
                    disallow: ['@angular/**'],
                    message: 'API infrastructure layer cannot import Angular. Keep infrastructure framework-agnostic.'
                },
                // Config domain cannot import Angular
                {
                    from: 'config-domain',
                    disallow: ['@angular/**'],
                    message: 'Config domain layer cannot import Angular. Keep domain logic framework-agnostic.'
                },
                // Config application cannot import Angular
                {
                    from: 'config-application',
                    disallow: ['@angular/**'],
                    message: 'Config application layer cannot import Angular. Keep application logic framework-agnostic.'
                },
                // Config infrastructure cannot import Angular
                {
                    from: 'config-infrastructure',
                    disallow: ['@angular/**'],
                    message: 'Config infrastructure layer cannot import Angular. Keep infrastructure framework-agnostic.'
                }
            ]
        }
    ]
};
