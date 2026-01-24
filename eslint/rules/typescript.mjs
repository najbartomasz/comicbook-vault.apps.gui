export const typescriptRules = {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': [
        'error',
        {
            default: 'array-simple'
        }
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/ban-tslint-comment': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/class-literal-property-style': [
        'error',
        'fields'
    ],
    '@typescript-eslint/class-methods-use-this': [
        'error',
        {
            ignoreClassesThatImplementAnInterface: true
        }
    ],
    '@typescript-eslint/consistent-generic-constructors': [
        'error',
        'constructor'
    ],
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
    '@typescript-eslint/consistent-return': 'error',
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' }],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-exports': ['error', { fixMixedExportsWithInlineTypeSpecifier: true }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
    '@typescript-eslint/default-param-last': 'error',
    '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
    '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true
        }
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit', overrides: { constructors: 'off' } }],
    '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: false }],
    '@typescript-eslint/init-declarations': 'off',
    '@typescript-eslint/max-params': [
        'error',
        {
            max: 4
        }
    ],
    '@typescript-eslint/member-ordering': [
        'error',
        {
            default: [
                'signature',
                'public-static-field',
                'protected-static-field',
                'private-static-field',
                'public-instance-field',
                'protected-instance-field',
                'private-instance-field',
                'public-constructor',
                'protected-constructor',
                'private-constructor',
                'public-static-method',
                'protected-static-method',
                'private-static-method',
                'public-instance-method',
                'protected-instance-method',
                'private-instance-method'
            ]
        }
    ],
    '@typescript-eslint/method-signature-style': [
        'error',
        'method'
    ],
    '@typescript-eslint/naming-convention': [
        'error',
        {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
        },
        {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
        },
        {
            selector: 'typeLike',
            format: ['PascalCase']
        },
        {
            selector: 'enumMember',
            format: ['PascalCase']
        },
        {
            selector: 'property',
            format: null
        }
    ],
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-array-delete': 'error',
    '@typescript-eslint/no-base-to-string': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-deprecated': 'error',
    '@typescript-eslint/no-dupe-class-members': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-duplicate-type-constituents': 'error',
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-object-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-floating-promises': [
        'error',
        {
            ignoreVoid: true,
            ignoreIIFE: false
        }
    ],
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'off',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-invalid-this': 'error',
    '@typescript-eslint/no-invalid-void-type': 'error',
    '@typescript-eslint/no-loop-func': 'error',
    '@typescript-eslint/no-loss-of-precision': 'error',
    '@typescript-eslint/no-magic-numbers': [
        'error',
        {
            ignore: [0, 1, -1],
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            ignoreEnums: true,
            ignoreNumericLiteralTypes: true,
            ignoreReadonlyClassProperties: true,
            ignoreTypeIndexes: true,
            ignoreClassFieldInitialValues: true
        }
    ],
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-misused-promises': [
        'error',
        {
            checksVoidReturn: true,
            checksConditionals: true
        }
    ],
    '@typescript-eslint/no-misused-spread': 'error',
    '@typescript-eslint/no-mixed-enums': 'error',
    '@typescript-eslint/no-namespace': [
        'error',
        {
            allowDeclarations: false,
            allowDefinitionFiles: true
        }
    ],
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-redundant-type-constituents': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-restricted-imports': [
        'error',
        {
            patterns: [
                {
                    regex: '@features/[^/]+$',
                    message: 'Cannot import from top-level feature barrel. Use specific layer: @features/*/domain, etc.'
                },
                {
                    regex: '@lib/[^/]+$',
                    message: 'Cannot import from top-level lib barrel. Use specific layer: @lib/*/domain, etc.'
                }
            ]
        }
    ],
    '@typescript-eslint/no-restricted-types': 'error',
    '@typescript-eslint/no-shadow': [
        'error',
        {
            builtinGlobals: false,
            hoist: 'all',
            ignoreTypeValueShadow: true,
            ignoreFunctionTypeParameterNameValueShadow: true
        }
    ],
    '@typescript-eslint/no-this-alias': [
        'error',
        {
            allowDestructuring: true,
            allowedNames: []
        }
    ],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
            allowConstantLoopConditions: true
        }
    ],
    '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-template-expression': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    '@typescript-eslint/no-unnecessary-type-conversion': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unnecessary-type-parameters': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-unsafe-enum-comparison': 'error',
    '@typescript-eslint/no-unsafe-function-type': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-unary-minus': 'error',
    '@typescript-eslint/no-unused-expressions': [
        'error',
        {
            allowShortCircuit: false,
            allowTernary: false,
            allowTaggedTemplates: false
        }
    ],
    '@typescript-eslint/no-unused-private-class-members': 'error',
    '@typescript-eslint/no-unused-vars': [
        'error',
        {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: true,
            argsIgnorePattern: '^_'
        }
    ],
    '@typescript-eslint/no-use-before-define': [
        'error',
        {
            functions: false,
            classes: true,
            variables: true,
            enums: true,
            typedefs: true,
            ignoreTypeReferences: true
        }
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/no-wrapper-object-types': 'error',
    '@typescript-eslint/non-nullable-type-assertion-style': 'error',
    '@typescript-eslint/only-throw-error': 'error',
    '@typescript-eslint/parameter-properties': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-destructuring': [
        'error',
        {
            VariableDeclarator: {
                array: false,
                object: true
            },
            AssignmentExpression: {
                array: false,
                object: false
            }
        }
    ],
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-find': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
            ignoreConditionalTests: false,
            ignoreTernaryTests: false,
            ignoreMixedLogicalExpressions: false
        }
    ],
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-promise-reject-errors': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-regexp-exec': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/promise-function-async': [
        'error',
        {
            allowAny: false,
            allowedPromiseNames: [],
            checkArrowFunctions: true,
            checkFunctionDeclarations: true,
            checkFunctionExpressions: true,
            checkMethodDeclarations: true
        }
    ],
    '@typescript-eslint/require-array-sort-compare': [
        'error',
        {
            ignoreStringArrays: false
        }
    ],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/related-getter-setter-pairs': 'error',
    '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
            allowAny: false,
            allowBoolean: false,
            allowNullish: false,
            allowNumberAndString: false,
            allowRegExp: false
        }
    ],
    '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
            allowAny: false,
            allowBoolean: false,
            allowNullish: false,
            allowNumber: true,
            allowRegExp: false
        }
    ],
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
            allowDefaultCaseForExhaustiveSwitch: true,
            requireDefaultForNonUnion: false
        }
    ],
    '@typescript-eslint/triple-slash-reference': [
        'error',
        {
            lib: 'never',
            path: 'never',
            types: 'never'
        }
    ],
    '@typescript-eslint/typedef': 'error',
    '@typescript-eslint/unbound-method': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error'
};
