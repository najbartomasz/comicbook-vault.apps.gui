/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [
        {
            name: 'no-circular',
            severity: 'warn',
            comment:
                'This dependency is part of a circular relationship. You might want to revise ' +
                'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
            from: {},
            to: {
                circular: true
            }
        },
        {
            name: 'no-orphans',
            comment:
                "This is an orphan module - it's likely not used (anymore?). Either use it or " +
                "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
                "add an exception for it in your dependency-cruiser configuration. By default " +
                "this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration " +
                "files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
            severity: 'warn',
            from: {
                orphan: true,
                pathNot: [
                    '(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$',                  // dot files
                    '[.]d[.]ts$',                                                       // TypeScript declaration files
                    '(^|/)tsconfig[.]json$',                                            // TypeScript config
                    '(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$', // other configs
                    '^src/main[.]ts$',                                                  // main entry point
                    '^src/main[.]server[.]ts$',                                         // server main entry point
                    '^src/server[.]ts$'                                                 // SSR server entry point
                ]
            },
            to: {},
        },

        {
            name: 'no-non-package-json',
            severity: 'error',
            comment:
                "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
                "That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
                "available on live with an non-guaranteed version. Fix it by adding the package to the dependencies " +
                "in your package.json.",
            from: {},
            to: {
                dependencyTypes: [
                    'npm-no-pkg',
                    'npm-unknown'
                ]
            }
        },
        {
            name: 'not-to-unresolvable',
            comment:
                "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
                'module: add it to your package.json. In all other cases you likely already know what to do.',
            severity: 'error',
            from: {},
            to: {
                couldNotResolve: true
            }
        },
        {
            name: 'no-duplicate-dep-types',
            comment:
                "Likely this module depends on an external ('npm') package that occurs more than once " +
                "in your package.json i.e. bot as a devDependencies and in dependencies. This will cause " +
                "maintenance problems later on.",
            severity: 'warn',
            from: {},
            to: {
                moreThanOneDependencyType: true,
                // as it's pretty common to have a type import be a type only import
                // _and_ (e.g.) a devDependency - don't consider type-only dependency
                // types for this rule
                dependencyTypesNot: ["type-only"]
            }
        },

        /* rules you might want to tweak for your specific situation: */

        {
            name: 'not-to-spec',
            comment:
                'This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. ' +
                "If there's something in a spec that's of use to other modules, it doesn't have that single " +
                'responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.',
            severity: 'error',
            from: {},
            to: {
                path: '[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
            }
        },
        {
            name: 'not-to-dev-dep',
            severity: 'error',
            comment:
                "This module depends on an npm package from the 'devDependencies' section of your " +
                'package.json. It looks like something that ships to production, though. To prevent problems ' +
                "with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
                'section of your package.json. If this module is development only - add it to the ' +
                'from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration',
            from: {
                path: '^(src)',
                pathNot: '[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
            },
            to: {
                dependencyTypes: [
                    'npm-dev',
                ],
                // type only dependencies are not a problem as they don't end up in the
                // production code or are ignored by the runtime.
                dependencyTypesNot: [
                    'type-only'
                ],
                pathNot: [
                    'node_modules/@types/'
                ]
            }
        },


        /* Architecture boundary rules - layered architecture enforcement */

        // Domain layer rules (lib-domain and feature-domain)
        {
            name: 'lib-domain-no-angular',
            severity: 'error',
            comment: 'Domain layer cannot import Angular. Keep domain logic framework-agnostic.',
            from: {
                path: '^src/app/lib/[^/]+/domain/'
            },
            to: {
                path: 'node_modules/@angular/'
            }
        },
        {
            name: 'lib-domain-pure',
            severity: 'error',
            comment: 'Domain layer cannot import from infrastructure or presentation layers. Keep domain logic pure and framework-agnostic.',
            from: {
                path: '^src/app/lib/[^/]+/domain/'
            },
            to: {
                path: '^src/app/(lib/[^/]+/(application|infrastructure|presentation)|features/|shell/|config/)'
            }
        },
        {
            name: 'feature-domain-no-angular',
            severity: 'error',
            comment: 'Feature domain layer cannot import Angular. Keep domain logic framework-agnostic.',
            from: {
                path: '^src/app/features/[^/]+/domain/'
            },
            to: {
                path: 'node_modules/@angular/'
            }
        },
        {
            name: 'feature-domain-pure',
            severity: 'error',
            comment: 'Feature domain layer cannot import from infrastructure or presentation layers. Keep domain logic pure and framework-agnostic.',
            from: {
                path: '^src/app/features/([^/]+)/domain/'
            },
            to: {
                pathNot: [
                    '^src/app/lib/[^/]+/domain/',
                    '^src/app/features/\\1/domain/'
                ]
            }
        },

        // Application layer rules (lib-application and feature-application)
        {
            name: 'lib-application-no-angular',
            severity: 'error',
            comment: 'Application layer cannot import Angular. Keep application logic framework-agnostic.',
            from: {
                path: '^src/app/lib/[^/]+/application/'
            },
            to: {
                path: 'node_modules/@angular/'
            }
        },
        {
            name: 'lib-application-framework-agnostic',
            severity: 'error',
            comment: 'Application layer cannot import from infrastructure or presentation layers. Keep application logic framework-agnostic.',
            from: {
                path: '^src/app/lib/[^/]+/application/'
            },
            to: {
                path: '^src/app/(lib/[^/]+/(infrastructure|presentation)|features/[^/]+/(application|infrastructure|presentation)|shell/|config/)'
            }
        },
        {
            name: 'feature-application-no-angular',
            severity: 'error',
            comment: 'Feature application layer cannot import Angular. Keep application logic framework-agnostic.',
            from: {
                path: '^src/app/features/[^/]+/application/'
            },
            to: {
                path: 'node_modules/@angular/'
            }
        },
        {
            name: 'feature-application-framework-agnostic',
            severity: 'error',
            comment: 'Feature application layer cannot import from infrastructure or presentation layers. Keep application logic framework-agnostic.',
            from: {
                path: '^src/app/features/([^/]+)/application/'
            },
            to: {
                path: '^src/app/(lib/[^/]+/(infrastructure|presentation)|features/(?!\\1/)[^/]+/|features/\\1/(infrastructure|presentation)|shell/|config/)'
            }
        },

        // Infrastructure layer rules (lib-infrastructure and feature-infrastructure)
        {
            name: 'lib-infrastructure-no-angular',
            severity: 'error',
            comment: 'Infrastructure layer cannot import Angular. Keep infrastructure framework-agnostic.',
            from: {
                path: '^src/app/lib/[^/]+/infrastructure/'
            },
            to: {
                path: 'node_modules/@angular/'
            }
        },
        {
            name: 'lib-infrastructure-no-presentation',
            severity: 'error',
            comment: 'Infrastructure layer cannot import from presentation layer. Keep infrastructure framework-agnostic.',
            from: {
                path: '^src/app/lib/[^/]+/infrastructure/'
            },
            to: {
                path: '^src/app/(lib/[^/]+/presentation|features/[^/]+/(infrastructure|presentation)|shell/|config/)'
            }
        },
        {
            name: 'feature-infrastructure-no-angular',
            severity: 'error',
            comment: 'Feature infrastructure layer cannot import Angular. Keep infrastructure framework-agnostic.',
            from: {
                path: '^src/app/features/[^/]+/infrastructure/'
            },
            to: {
                path: 'node_modules/@angular/'
            }
        },
        {
            name: 'feature-infrastructure-no-presentation',
            severity: 'error',
            comment: 'Feature infrastructure layer cannot import from presentation layer. Keep infrastructure framework-agnostic.',
            from: {
                path: '^src/app/features/([^/]+)/infrastructure/'
            },
            to: {
                path: '^src/app/(lib/[^/]+/presentation|features/(?!\\1/)[^/]+/|features/\\1/presentation|shell/|config/)'
            }
        },

        // Presentation layer rules (lib-presentation and feature-presentation)
        {
            name: 'lib-presentation-no-di-tokens',
            severity: 'error',
            comment: 'Lib presentation cannot import DI tokens directly. Use injection functions from di-inject-functions instead.',
            from: {
                path: '^src/app/lib/[^/]+/presentation/'
            },
            to: {
                path: '^src/app/di/[^/]+/injection-tokens/'
            }
        },
        {
            name: 'feature-presentation-no-di-tokens',
            severity: 'error',
            comment: 'Feature presentation cannot import DI tokens directly. Use injection functions from di-inject-functions instead.',
            from: {
                path: '^src/app/features/[^/]+/presentation/'
            },
            to: {
                path: '^src/app/di/[^/]+/injection-tokens/'
            }
        },
        {
            name: 'feature-presentation-same-feature-only',
            severity: 'error',
            comment: 'Feature presentation can only import from its own feature or shared lib modules.',
            from: {
                path: '^src/app/features/([^/]+)/presentation/'
            },
            to: {
                path: '^src/app/features/(?!\\1/)[^/]+/'
            }
        },

        // DI layer rules
        {
            name: 'di-injection-tokens-no-providers',
            severity: 'error',
            comment: 'DI tokens can import from other tokens, injections, lib layers, and config, but must not depend on providers.',
            from: {
                path: '^src/app/di/[^/]+/injection-tokens/'
            },
            to: {
                path: '^src/app/di/[^/]+/providers/'
            }
        },
        {
            name: 'di-inject-functions-no-providers',
            severity: 'error',
            comment: 'DI injections can import tokens, lib layers, and config, but not providers.',
            from: {
                path: '^src/app/di/[^/]+/inject-functions/'
            },
            to: {
                path: '^src/app/di/[^/]+/providers/'
            }
        },
        {
            name: 'shell-no-di-tokens',
            severity: 'error',
            comment: 'Shell cannot import DI tokens directly. Use injection functions from di-inject-functions instead.',
            from: {
                path: '^src/app/shell/'
            },
            to: {
                path: '^src/app/di/[^/]+/injection-tokens/'
            }
        },

        // Entry point rules - enforce index.ts barrel exports
        {
            name: 'di-tokens-entry-point',
            severity: 'error',
            comment: 'DI tokens must export through their index.ts. Import from the index.ts barrel file.',
            from: {
                pathNot: '^src/app/di/([^/]+)/injection-tokens/'
            },
            to: {
                path: '^src/app/di/([^/]+)/injection-tokens/(?!index\\.ts$)',
                pathNot: '[.]spec[.]ts$'
            }
        },
        {
            name: 'di-inject-functions-entry-point',
            severity: 'error',
            comment: 'DI injections must export through their index.ts. Import from the index.ts barrel file.',
            from: {
                pathNot: '^src/app/di/([^/]+)/inject-functions/'
            },
            to: {
                path: '^src/app/di/([^/]+)/inject-functions/(?!index\\.ts$)',
                pathNot: '[.]spec[.]ts$'
            }
        },
        {
            name: 'di-providers-entry-point',
            severity: 'error',
            comment: 'DI providers must export through their index.ts. Import from the index.ts barrel file.',
            from: {
                pathNot: '^src/app/di/([^/]+)/providers/'
            },
            to: {
                path: '^src/app/di/([^/]+)/providers/(?!index\\.ts$)',
                pathNot: '[.]spec[.]ts$'
            }
        },
        {
            name: 'lib-layer-entry-point',
            severity: 'error',
            comment: 'Lib layers must export through their index.ts (barrel files only). Import from the index.ts barrel file.',
            from: {
                pathNot: '^src/app/lib/([^/]+)/(domain|application|infrastructure|presentation)/'
            },
            to: {
                path: '^src/app/lib/([^/]+)/(domain|application|infrastructure|presentation)/(?!index\\.ts$)',
                pathNot: '[.]spec[.]ts$'
            }
        },
        {
            name: 'feature-layer-entry-point',
            severity: 'error',
            comment: 'Feature layers must export through their index.ts. Import from the index.ts barrel file.',
            from: {
                pathNot: '^src/app/features/([^/]+)/(domain|application|infrastructure|presentation)/'
            },
            to: {
                path: '^src/app/features/([^/]+)/(domain|application|infrastructure|presentation)/(?!index\\.ts$)',
                pathNot: '[.]spec[.]ts$'
            }
        },
        {
            name: 'testing-entry-point',
            severity: 'error',
            comment: 'Testing utilities must be imported through index.ts. Import from the index.ts barrel file.',
            from: {
                pathNot: '^src/testing/'
            },
            to: {
                path: '^src/testing/(?!.*/index\\.ts$)',
                pathNot: '[.]spec[.]ts$'
            }
        }
    ],
    options: {
        doNotFollow: {
            path: ['node_modules']
        },
        exclude: {
            path: [String.raw`\.spec\.ts$`]
        },
        includeOnly: ['^src/(?!testing/)'],
        prefix: 'https://github.com/najbartomasz/comicbook-vault.apps.gui/blob/main/',
        tsPreCompilationDeps: true,
        tsConfig: {
            fileName: 'tsconfig.app.json'
        },
        enhancedResolveOptions: {
            exportsFields: ["exports"],
            conditionNames: ["import", "require", "node", "default", "types"],
            mainFields: ["main", "types", "typings"]
        },
        skipAnalysisNotInRules: true,
        reporterOptions: {
            dot: {
                collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
                theme: {
                    graph: {
                        splines: "polyline",
                        rankdir: "LR"
                    }
                }
            },
            text: {
                highlightFocused: true
            }
        }
    }
};
