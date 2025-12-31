import angularEslint from '@angular-eslint/eslint-plugin';
import angularTemplateEslint from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import eslint from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';
import boundariesPlugin from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import securityPlugin from 'eslint-plugin-security';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.ts'],
        ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.angular/**'],
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.app.json',
                tsconfigRootDir: import.meta.dirname,
                ecmaVersion: 2024,
                sourceType: 'module'
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                fetch: 'readonly',
                structuredClone: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly'
            }
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.app.json'
                }
            },
            'import/internal-regex': '^@(lib|features|shell)/',
            'boundaries/elements': [
                {
                    type: 'shell',
                    pattern: 'src/app/shell/**',
                    mode: 'folder'
                },
                {
                    type: 'lib-core',
                    pattern: 'src/app/lib/core/**',
                    mode: 'folder'
                },
                {
                    type: 'lib-domain',
                    pattern: 'src/app/lib/domain/**',
                    mode: 'folder'
                },
                {
                    type: 'lib-infrastructure',
                    pattern: 'src/app/lib/infrastructure/**',
                    mode: 'folder'
                },
                {
                    type: 'lib-presentation',
                    pattern: 'src/app/lib/presentation/**',
                    mode: 'folder'
                },
                {
                    type: 'feature',
                    pattern: 'src/app/features/*',
                    mode: 'folder',
                    capture: ['featureName']
                },
                {
                    type: 'feature-core',
                    pattern: 'src/app/features/*/core/**',
                    mode: 'folder',
                    capture: ['featureName']
                },
                {
                    type: 'feature-domain',
                    pattern: 'src/app/features/*/domain/**',
                    mode: 'folder',
                    capture: ['featureName']
                },
                {
                    type: 'feature-infrastructure',
                    pattern: 'src/app/features/*/infrastructure/**',
                    mode: 'folder',
                    capture: ['featureName']
                },
                {
                    type: 'feature-presentation',
                    pattern: 'src/app/features/*/presentation/**',
                    mode: 'folder',
                    capture: ['featureName']
                }
            ],
            'boundaries/include': ['src/app/**']
        },
        plugins: {
            '@angular-eslint': angularEslint,
            '@stylistic': stylisticPlugin,
            '@typescript-eslint': tseslint.plugin,
            boundaries: boundariesPlugin,
            import: importPlugin,
            promise: promisePlugin,
            sonarjs: sonarjsPlugin,
            security: securityPlugin
        },
        rules: {
            ...eslint.configs.recommended.rules,
            ...tseslint.configs.recommended[0].rules,
            ...tseslint.configs.stylistic[0].rules,
            ...angularEslint.configs.recommended.rules,
            // Core Rules
            'constructor-super': 'error',
            'curly': [
                'error',
                'all'
            ],
            'for-direction': 'error',
            'getter-return': 'error',
            'no-async-promise-executor': 'error',
            'no-case-declarations': 'error',
            'no-class-assign': 'error',
            'no-compare-neg-zero': 'error',
            'no-cond-assign': 'error',
            'no-console': 'error',
            'no-const-assign': 'error',
            'no-constant-condition': [
                'error',
                {
                    checkLoops: 'allExceptWhileTrue'
                }
            ],
            'no-control-regex': 'error',
            'no-debugger': 'error',
            'no-delete-var': 'error',
            'no-dupe-args': 'error',
            'no-dupe-class-members': 'error',
            'no-dupe-else-if': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty': 'error',
            'no-empty-character-class': 'error',
            'no-empty-pattern': 'error',
            'no-ex-assign': 'error',
            'no-extra-boolean-cast': 'error',
            'no-extra-semi': 'error',
            'no-fallthrough': 'error',
            'no-func-assign': 'error',
            'eqeqeq': [
                'error',
                'always'
            ],
            'no-global-assign': 'error',
            'no-import-assign': 'error',
            'no-inner-declarations': 'error',
            'no-invalid-regexp': 'error',
            'no-irregular-whitespace': 'error',
            'no-loss-of-precision': 'error',
            'no-misleading-character-class': 'error',
            'no-mixed-spaces-and-tabs': 'error',
            'no-new-symbol': 'error',
            'no-nonoctal-decimal-escape': 'error',
            'no-obj-calls': 'error',
            'no-octal': 'error',
            'no-prototype-builtins': 'error',
            'no-redeclare': 'error',
            'no-regex-spaces': 'error',
            'no-self-assign': 'error',
            'no-setter-return': 'error',
            'no-shadow-restricted-names': 'error',
            'no-sparse-arrays': 'error',
            'no-this-before-super': 'error',
            'no-undef': 'error',
            'no-unexpected-multiline': 'error',
            'no-unreachable': 'error',
            'no-unsafe-finally': 'error',
            'no-unsafe-negation': 'error',
            'no-unsafe-optional-chaining': 'error',
            'no-unused-labels': 'error',
            'no-unused-vars': 'error',
            'no-useless-backreference': 'error',
            'no-useless-catch': 'error',
            'no-useless-escape': 'error',
            'no-var': 'error',
            'no-with': 'error',
            'no-await-in-loop': 'error',
            'no-constructor-return': 'error',
            'no-promise-executor-return': 'error',
            'no-template-curly-in-string': 'error',
            'no-useless-assignment': 'error',
            'prefer-const': 'error',
            'prefer-object-spread': 'error',
            'require-yield': 'error',
            'semi': [
                'error',
                'always'
            ],
            'quotes': [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: false
                }
            ],
            'comma-dangle': [
                'error',
                'never'
            ],
            'arrow-parens': [
                'error',
                'always'
            ],
            'no-confusing-arrow': [
                'error',
                {
                    allowParens: true,
                    onlyOneSimpleParam: false
                }
            ],
            'object-curly-spacing': [
                'error',
                'always'
            ],
            'array-bracket-spacing': [
                'error',
                'never'
            ],
            'brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: false
                }
            ],
            'comma-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],
            'func-call-spacing': [
                'error',
                'never'
            ],
            'indent': [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],
            'keyword-spacing': [
                'error',
                {
                    before: true,
                    after: true
                }
            ],
            'space-before-blocks': [
                'error',
                'always'
            ],
            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    named: 'never',
                    asyncArrow: 'always'
                }
            ],
            'space-infix-ops': [
                'error',
                {
                    int32Hint: false
                }
            ],
            'use-isnan': 'error',
            'valid-typeof': 'error',
            'max-len': [
                'error',
                {
                    code: 140,
                    ignoreUrls: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true
                }
            ],
            // Stylistic Rules
            '@stylistic/array-bracket-newline': [
                'error',
                {
                    multiline: true,
                    minItems: null
                }
            ],
            '@stylistic/array-bracket-spacing': [
                'error',
                'never',
                {
                    singleValue: false,
                    objectsInArrays: false,
                    arraysInArrays: false
                }
            ],
            '@stylistic/array-element-newline': [
                'error',
                {
                    ArrayExpression: 'consistent',
                    ArrayPattern: {
                        minItems: 3
                    }
                }
            ],
            '@stylistic/arrow-parens': [
                'error',
                'always'
            ],
            '@stylistic/arrow-spacing': [
                'error',
                {
                    before: true,
                    after: true
                }
            ],
            '@stylistic/block-spacing': [
                'error',
                'always'
            ],
            '@stylistic/brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: false
                }
            ],
            '@stylistic/comma-dangle': [
                'error',
                'never'
            ],
            '@stylistic/comma-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],
            '@stylistic/comma-style': [
                'error',
                'last',
                {
                    exceptions: {
                        ArrayExpression: false,
                        ArrayPattern: false,
                        ArrowFunctionExpression: false,
                        CallExpression: false,
                        FunctionDeclaration: false,
                        FunctionExpression: false,
                        ImportDeclaration: false,
                        ObjectExpression: false,
                        ObjectPattern: false,
                        VariableDeclaration: false,
                        NewExpression: false
                    }
                }
            ],
            '@stylistic/computed-property-spacing': [
                'error',
                'never',
                {
                    enforceForClassMembers: true
                }
            ],
            '@stylistic/dot-location': [
                'error',
                'property'
            ],
            '@stylistic/eol-last': [
                'error',
                'always'
            ],
            '@stylistic/function-call-argument-newline': [
                'error',
                'consistent'
            ],
            '@stylistic/function-call-spacing': [
                'error',
                'never'
            ],
            '@stylistic/function-paren-newline': [
                'error',
                'multiline-arguments'
            ],
            '@stylistic/generator-star-spacing': [
                'error',
                {
                    before: true,
                    after: false,
                    anonymous: {
                        before: true,
                        after: false
                    },
                    method: {
                        before: true,
                        after: false
                    }
                }
            ],
            '@stylistic/implicit-arrow-linebreak': [
                'error',
                'beside'
            ],
            '@stylistic/indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                    VariableDeclarator: 1,
                    outerIIFEBody: 1,
                    MemberExpression: 1,
                    FunctionDeclaration: {
                        parameters: 1,
                        body: 1
                    },
                    FunctionExpression: {
                        parameters: 1,
                        body: 1
                    },
                    CallExpression: {
                        arguments: 1
                    },
                    ArrayExpression: 1,
                    ObjectExpression: 1,
                    ImportDeclaration: 1,
                    flatTernaryExpressions: false,
                    offsetTernaryExpressions: false,
                    ignoredNodes: []
                }
            ],
            '@stylistic/indent-binary-ops': [
                'error',
                4
            ],
            '@stylistic/key-spacing': [
                'error',
                {
                    beforeColon: false,
                    afterColon: true,
                    mode: 'strict'
                }
            ],
            '@stylistic/keyword-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                    overrides: {}
                }
            ],
            '@stylistic/line-comment-position': [
                'error',
                {
                    position: 'above',
                    ignorePattern: '',
                    applyDefaultIgnorePatterns: true
                }
            ],
            '@stylistic/linebreak-style': [
                'error',
                'unix'
            ],
            '@stylistic/lines-around-comment': [
                'error',
                {
                    beforeBlockComment: true,
                    afterBlockComment: false,
                    beforeLineComment: true,
                    afterLineComment: false,
                    allowBlockStart: true,
                    allowBlockEnd: true,
                    allowClassStart: true,
                    allowClassEnd: true,
                    allowObjectStart: true,
                    allowObjectEnd: true,
                    allowArrayStart: true,
                    allowArrayEnd: true,
                    allowInterfaceStart: true,
                    allowInterfaceEnd: true,
                    allowTypeStart: true,
                    allowTypeEnd: true,
                    allowEnumStart: true,
                    allowEnumEnd: true,
                    allowModuleStart: true,
                    allowModuleEnd: true
                }
            ],
            '@stylistic/lines-between-class-members': 'off',
            '@stylistic/max-len': [
                'error',
                {
                    code: 140,
                    tabWidth: 4,
                    ignoreComments: false,
                    ignoreTrailingComments: false,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                    ignorePattern: ''
                }
            ],
            '@stylistic/max-statements-per-line': [
                'error',
                {
                    max: 1
                }
            ],
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: {
                        delimiter: 'semi',
                        requireLast: true
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false
                    },
                    multilineDetection: 'brackets'
                }
            ],
            '@stylistic/multiline-comment-style': [
                'error',
                'starred-block'
            ],
            '@stylistic/multiline-ternary': [
                'error',
                'always-multiline'
            ],
            '@stylistic/new-parens': [
                'error',
                'always'
            ],
            '@stylistic/newline-per-chained-call': [
                'error',
                {
                    ignoreChainWithDepth: 2
                }
            ],
            '@stylistic/no-confusing-arrow': [
                'error',
                {
                    allowParens: true,
                    onlyOneSimpleParam: false
                }
            ],
            '@stylistic/no-extra-parens': [
                'error',
                'all',
                {
                    conditionalAssign: true,
                    returnAssign: true,
                    nestedBinaryExpressions: false,
                    ternaryOperandBinaryExpressions: false,
                    ignoreJSX: 'none',
                    enforceForSequenceExpressions: false,
                    enforceForFunctionPrototypeMethods: false,
                    allowParensAfterCommentPattern: '',
                    ignoredNodes: [
                        'ArrowFunctionExpression',
                        'NewExpression'
                    ]
                }
            ],
            '@stylistic/no-extra-semi': 'error',
            '@stylistic/no-floating-decimal': 'error',
            '@stylistic/no-mixed-operators': [
                'error',
                {
                    groups: [
                        ['+', '-', '*', '/', '%', '**'],
                        ['&', '|', '^', '~', '<<', '>>', '>>>'],
                        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                        ['&&', '||'],
                        ['in', 'instanceof']
                    ],
                    allowSamePrecedence: true
                }
            ],
            '@stylistic/no-mixed-spaces-and-tabs': 'error',
            '@stylistic/no-multi-spaces': [
                'error',
                {
                    ignoreEOLComments: false,
                    exceptions: {
                        Property: false
                    },
                    includeTabs: true
                }
            ],
            '@stylistic/no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                    maxEOF: 1,
                    maxBOF: 0
                }
            ],
            '@stylistic/no-tabs': [
                'error',
                {
                    allowIndentationTabs: false
                }
            ],
            '@stylistic/no-trailing-spaces': [
                'error',
                {
                    skipBlankLines: false,
                    ignoreComments: false
                }
            ],
            '@stylistic/no-whitespace-before-property': 'error',
            '@stylistic/nonblock-statement-body-position': [
                'error',
                'beside',
                {
                    overrides: {}
                }
            ],
            '@stylistic/object-curly-newline': 'off',
            '@stylistic/object-curly-spacing': [
                'error',
                'always',
                {
                    arraysInObjects: true,
                    objectsInObjects: true
                }
            ],
            '@stylistic/object-property-newline': [
                'error',
                {
                    allowAllPropertiesOnSameLine: true
                }
            ],
            '@stylistic/one-var-declaration-per-line': [
                'error',
                'always'
            ],
            '@stylistic/operator-linebreak': [
                'error',
                'before',
                {
                    overrides: {
                        '=': 'after',
                        '|': 'before'
                    }
                }
            ],
            '@stylistic/padded-blocks': [
                'error',
                'never',
                {
                    allowSingleLineBlocks: true
                }
            ],
            '@stylistic/padding-line-between-statements': 'off',
            '@stylistic/quote-props': [
                'error',
                'as-needed',
                {
                    keywords: false,
                    unnecessary: true,
                    numbers: false
                }
            ],
            '@stylistic/quotes': [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: 'never'
                }
            ],
            '@stylistic/rest-spread-spacing': [
                'error',
                'never'
            ],
            '@stylistic/semi': [
                'error',
                'always',
                {
                    omitLastInOneLineBlock: false,
                    omitLastInOneLineClassBody: false
                }
            ],
            '@stylistic/semi-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],
            '@stylistic/semi-style': [
                'error',
                'last'
            ],
            '@stylistic/space-before-blocks': [
                'error',
                'always'
            ],
            '@stylistic/space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    named: 'never',
                    asyncArrow: 'always'
                }
            ],
            '@stylistic/space-in-parens': [
                'error',
                'never',
                {
                    exceptions: []
                }
            ],
            '@stylistic/space-infix-ops': [
                'error',
                {
                    int32Hint: false
                }
            ],
            '@stylistic/space-unary-ops': [
                'error',
                {
                    words: true,
                    nonwords: false,
                    overrides: {}
                }
            ],
            '@stylistic/spaced-comment': [
                'error',
                'always',
                {
                    line: {
                        markers: ['/'],
                        exceptions: ['-', '+']
                    },
                    block: {
                        markers: ['!'],
                        exceptions: ['*'],
                        balanced: true
                    }
                }
            ],
            '@stylistic/switch-colon-spacing': [
                'error',
                {
                    after: true,
                    before: false
                }
            ],
            '@stylistic/template-curly-spacing': [
                'error',
                'never'
            ],
            '@stylistic/template-tag-spacing': [
                'error',
                'never'
            ],
            '@stylistic/type-annotation-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                    overrides: {}
                }
            ],
            '@stylistic/type-generic-spacing': 'error',
            '@stylistic/type-named-tuple-spacing': 'error',
            '@stylistic/wrap-iife': [
                'error',
                'inside',
                {
                    functionPrototypeMethods: true
                }
            ],
            '@stylistic/wrap-regex': 'error',
            '@stylistic/yield-star-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],
            // Angular Rules
            '@angular-eslint/component-class-suffix': 'error',
            '@angular-eslint/component-max-inline-declarations': [
                'error',
                {
                    template: 10,
                    styles: 5,
                    animations: 5
                }
            ],
            '@angular-eslint/consistent-component-styles': 'error',
            '@angular-eslint/contextual-decorator': 'error',
            '@angular-eslint/contextual-lifecycle': 'error',
            '@angular-eslint/directive-class-suffix': 'error',
            '@angular-eslint/no-async-lifecycle-method': 'error',
            '@angular-eslint/no-attribute-decorator': 'error',
            '@angular-eslint/no-conflicting-lifecycle': 'error',
            '@angular-eslint/no-developer-preview': 'error',
            '@angular-eslint/no-duplicates-in-metadata-arrays': 'error',
            '@angular-eslint/no-empty-lifecycle-method': 'error',
            '@angular-eslint/no-experimental': 'error',
            '@angular-eslint/no-forward-ref': 'error',
            '@angular-eslint/no-input-prefix': 'error',
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-inputs-metadata-property': 'error',
            '@angular-eslint/no-lifecycle-call': 'error',
            '@angular-eslint/no-output-native': 'error',
            '@angular-eslint/no-output-on-prefix': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/no-outputs-metadata-property': 'error',
            '@angular-eslint/no-pipe-impure': 'error',
            '@angular-eslint/no-queries-metadata-property': 'error',
            '@angular-eslint/no-uncalled-signals': 'error',
            '@angular-eslint/pipe-prefix': 'error',
            '@angular-eslint/prefer-host-metadata-property': 'error',
            '@angular-eslint/prefer-inject': 'error',
            '@angular-eslint/prefer-on-push-component-change-detection': 'error',
            '@angular-eslint/prefer-output-emitter-ref': 'error',
            '@angular-eslint/prefer-output-readonly': 'error',
            '@angular-eslint/prefer-signals': 'error',
            '@angular-eslint/prefer-standalone': 'error',
            '@angular-eslint/relative-url-prefix': 'error',
            '@angular-eslint/require-lifecycle-on-prototype': 'error',
            '@angular-eslint/require-localize-metadata': 'error',
            '@angular-eslint/runtime-localize': 'error',
            '@angular-eslint/sort-keys-in-type-decorator': 'error',
            '@angular-eslint/sort-lifecycle-methods': 'error',
            '@angular-eslint/use-component-selector': 'error',
            '@angular-eslint/use-component-view-encapsulation': 'error',
            '@angular-eslint/use-injectable-provided-in': 'error',
            '@angular-eslint/use-lifecycle-interface': 'error',
            '@angular-eslint/use-pipe-transform-interface': 'error',
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],
            // TypeScript Rules
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
            '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true }],
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
                    format: ['camelCase', 'UPPER_CASE'],
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
            '@typescript-eslint/no-restricted-imports': 'off',
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
            '@typescript-eslint/return-await': [
                'error',
                'never'
            ],
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
            '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
            // Import rules
            'import/consistent-type-specifier-style': [
                'error',
                'prefer-inline'
            ],
            'import/default': 'error',
            'import/dynamic-import-chunkname': 'off',
            'import/export': 'error',
            'import/exports-last': 'error',
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    ts: 'never',
                    js: 'never'
                }
            ],
            'import/first': 'error',
            'import/group-exports': 'error',
            'import/imports-first': 'error',
            'import/max-dependencies': [
                'error',
                {
                    max: 15,
                    ignoreTypeImports: true
                }
            ],
            'import/named': 'error',
            'import/namespace': 'error',
            'import/newline-after-import': 'error',
            'import/no-absolute-path': 'error',
            'import/no-amd': 'error',
            'import/no-anonymous-default-export': 'error',
            'import/no-commonjs': 'error',
            'import/no-cycle': 'error',
            'import/no-default-export': 'error',
            'import/no-deprecated': 'error',
            'import/no-duplicates': 'error',
            'import/no-dynamic-require': 'error',
            'import/no-empty-named-blocks': 'error',
            'import/no-extraneous-dependencies': 'error',
            'import/no-import-module-exports': 'error',
            'import/no-internal-modules': 'off',
            'import/no-mutable-exports': 'error',
            'import/no-named-as-default': 'error',
            'import/no-named-as-default-member': 'error',
            'import/no-named-default': 'error',
            'import/no-named-export': 'off',
            'import/no-namespace': 'error',
            'import/no-nodejs-modules': 'off',
            'import/no-relative-packages': 'error',
            'import/no-relative-parent-imports': 'off',
            'import/no-restricted-paths': 'error',
            'import/no-self-import': 'error',
            'import/no-unassigned-import': 'error',
            'import/no-unresolved': 'error',
            'import/no-unused-modules': 'error',
            'import/no-useless-path-segments': 'error',
            'import/no-webpack-loader-syntax': 'error',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index'
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    }
                }
            ],
            'import/prefer-default-export': 'off',
            'import/unambiguous': 'error',
            // Promise Rules
            'promise/always-return': 'error',
            'promise/avoid-new': 'error',
            'promise/catch-or-return': 'error',
            'promise/no-callback-in-promise': 'error',
            'promise/no-multiple-resolved': 'error',
            'promise/no-native': 'off',
            'promise/no-nesting': 'error',
            'promise/no-new-statics': 'error',
            'promise/no-promise-in-callback': 'error',
            'promise/no-return-in-finally': 'error',
            'promise/no-return-wrap': 'error',
            'promise/param-names': 'error',
            'promise/prefer-await-to-callbacks': 'error',
            'promise/prefer-await-to-then': 'error',
            'promise/prefer-catch': 'error',
            'promise/spec-only': 'error',
            'promise/valid-params': 'error',
            // SonarJS Rules
            'sonarjs/anchor-precedence': 'error',
            'sonarjs/argument-type': 'error',
            'sonarjs/arguments-order': 'error',
            'sonarjs/arguments-usage': 'error',
            'sonarjs/array-callback-without-return': 'error',
            'sonarjs/array-constructor': 'error',
            'sonarjs/arrow-function-convention': [
                'error',
                {
                    requireParameterParentheses: true
                }
            ],
            'sonarjs/assertions-in-tests': 'error',
            'sonarjs/aws-apigateway-public-api': 'error',
            'sonarjs/aws-ec2-rds-dms-public': 'error',
            'sonarjs/aws-ec2-unencrypted-ebs-volume': 'error',
            'sonarjs/aws-efs-unencrypted': 'error',
            'sonarjs/aws-iam-all-privileges': 'error',
            'sonarjs/aws-iam-all-resources-accessible': 'error',
            'sonarjs/aws-iam-privilege-escalation': 'error',
            'sonarjs/aws-iam-public-access': 'error',
            'sonarjs/aws-opensearchservice-domain': 'error',
            'sonarjs/aws-rds-unencrypted-databases': 'error',
            'sonarjs/aws-restricted-ip-admin-access': 'error',
            'sonarjs/aws-s3-bucket-granted-access': 'error',
            'sonarjs/aws-s3-bucket-insecure-http': 'error',
            'sonarjs/aws-s3-bucket-public-access': 'error',
            'sonarjs/aws-s3-bucket-server-encryption': 'error',
            'sonarjs/aws-s3-bucket-versioning': 'error',
            'sonarjs/aws-sagemaker-unencrypted-notebook': 'error',
            'sonarjs/aws-sns-unencrypted-topics': 'error',
            'sonarjs/aws-sqs-unencrypted-queue': 'error',
            'sonarjs/bitwise-operators': 'error',
            'sonarjs/block-scoped-var': 'error',
            'sonarjs/bool-param-default': 'error',
            'sonarjs/call-argument-line': 'error',
            'sonarjs/certificate-transparency': 'error',
            'sonarjs/chai-determinate-assertion': 'error',
            'sonarjs/class-name': 'error',
            'sonarjs/class-prototype': 'error',
            'sonarjs/code-eval': 'error',
            'sonarjs/cognitive-complexity': [
                'error',
                15
            ],
            'sonarjs/comma-or-logical-or-case': 'error',
            'sonarjs/comment-regex': 'error',
            'sonarjs/concise-regex': 'error',
            'sonarjs/conditional-indentation': 'error',
            'sonarjs/confidential-information-logging': 'error',
            'sonarjs/constructor-for-side-effects': 'error',
            'sonarjs/content-length': 'error',
            'sonarjs/content-security-policy': 'error',
            'sonarjs/cookie-no-httponly': 'error',
            'sonarjs/cookies': 'error',
            'sonarjs/cors': 'error',
            'sonarjs/csrf': 'error',
            'sonarjs/cyclomatic-complexity': [
                'error',
                {
                    threshold: 10
                }
            ],
            'sonarjs/declarations-in-global-scope': 'error',
            'sonarjs/deprecation': 'error',
            'sonarjs/destructuring-assignment-syntax': 'error',
            'sonarjs/different-types-comparison': 'error',
            'sonarjs/disabled-auto-escaping': 'error',
            'sonarjs/disabled-resource-integrity': 'error',
            'sonarjs/disabled-timeout': 'error',
            'sonarjs/dns-prefetching': 'error',
            'sonarjs/duplicates-in-character-class': 'error',
            'sonarjs/elseif-without-else': 'error',
            'sonarjs/empty-string-repetition': 'error',
            'sonarjs/encryption': 'error',
            'sonarjs/encryption-secure-mode': 'error',
            'sonarjs/enforce-trailing-comma': [
                'error',
                'never'
            ],
            'sonarjs/existing-groups': 'error',
            'sonarjs/expression-complexity': 'error',
            'sonarjs/file-header': 'off',
            'sonarjs/file-name-differ-from-class': 'off',
            'sonarjs/file-permissions': 'error',
            'sonarjs/file-uploads': 'error',
            'sonarjs/fixme-tag': 'error',
            'sonarjs/for-in': 'error',
            'sonarjs/for-loop-increment-sign': 'error',
            'sonarjs/frame-ancestors': 'error',
            'sonarjs/function-inside-loop': 'error',
            'sonarjs/function-name': 'error',
            'sonarjs/function-return-type': 'error',
            'sonarjs/future-reserved-words': 'error',
            'sonarjs/generator-without-yield': 'error',
            'sonarjs/hashing': 'error',
            'sonarjs/hidden-files': 'error',
            'sonarjs/in-operator-type-error': 'error',
            'sonarjs/inconsistent-function-call': 'error',
            'sonarjs/index-of-compare-to-positive-number': 'error',
            'sonarjs/insecure-cookie': 'error',
            'sonarjs/insecure-jwt-token': 'error',
            'sonarjs/inverted-assertion-arguments': 'error',
            'sonarjs/jsx-no-leaked-render': 'error',
            'sonarjs/label-position': 'error',
            'sonarjs/link-with-target-blank': 'error',
            'sonarjs/max-lines': [
                'error',
                {
                    maximum: 300
                }
            ],
            'sonarjs/max-lines-per-function': [
                'error',
                {
                    maximum: 50
                }
            ],
            'sonarjs/max-switch-cases': 'error',
            'sonarjs/max-union-size': [
                'error',
                {
                    threshold: 5
                }
            ],
            'sonarjs/misplaced-loop-counter': 'error',
            'sonarjs/nested-control-flow': 'error',
            'sonarjs/new-operator-misuse': 'error',
            'sonarjs/no-all-duplicated-branches': 'error',
            'sonarjs/no-alphabetical-sort': 'error',
            'sonarjs/no-angular-bypass-sanitization': 'error',
            'sonarjs/no-array-delete': 'error',
            'sonarjs/no-associative-arrays': 'error',
            'sonarjs/no-async-constructor': 'error',
            'sonarjs/no-built-in-override': 'error',
            'sonarjs/no-case-label-in-switch': 'error',
            'sonarjs/no-clear-text-protocols': 'error',
            'sonarjs/no-code-after-done': 'error',
            'sonarjs/no-collapsible-if': 'error',
            'sonarjs/no-collection-size-mischeck': 'error',
            'sonarjs/no-commented-code': 'error',
            'sonarjs/no-control-regex': 'error',
            'sonarjs/no-dead-store': 'error',
            'sonarjs/no-delete-var': 'error',
            'sonarjs/no-duplicate-in-composite': 'error',
            'sonarjs/no-duplicate-string': [
                'error',
                {
                    threshold: 3,
                    ignoreStrings: 'application/json, utf-8'
                }
            ],
            'sonarjs/no-duplicated-branches': 'error',
            'sonarjs/no-element-overwrite': 'error',
            'sonarjs/no-empty-after-reluctant': 'error',
            'sonarjs/no-empty-alternatives': 'error',
            'sonarjs/no-empty-character-class': 'error',
            'sonarjs/no-empty-collection': 'error',
            'sonarjs/no-empty-group': 'error',
            'sonarjs/no-empty-test-file': 'error',
            'sonarjs/no-equals-in-for-termination': 'error',
            'sonarjs/no-exclusive-tests': 'error',
            'sonarjs/no-extra-arguments': 'error',
            'sonarjs/no-fallthrough': 'error',
            'sonarjs/no-for-in-iterable': 'error',
            'sonarjs/no-function-declaration-in-block': 'error',
            'sonarjs/no-global-this': 'error',
            'sonarjs/no-globals-shadowing': 'error',
            'sonarjs/no-gratuitous-expressions': 'error',
            'sonarjs/no-hardcoded-ip': 'error',
            'sonarjs/no-hardcoded-passwords': 'error',
            'sonarjs/no-hardcoded-secrets': 'error',
            'sonarjs/no-hook-setter-in-body': 'error',
            'sonarjs/no-identical-conditions': 'error',
            'sonarjs/no-identical-expressions': 'error',
            'sonarjs/no-identical-functions': [
                'error',
                3
            ],
            'sonarjs/no-ignored-exceptions': 'error',
            'sonarjs/no-ignored-return': 'error',
            'sonarjs/no-implicit-dependencies': 'error',
            'sonarjs/no-implicit-global': 'error',
            'sonarjs/no-in-misuse': 'error',
            'sonarjs/no-incomplete-assertions': 'error',
            'sonarjs/no-inconsistent-returns': 'error',
            'sonarjs/no-incorrect-string-concat': 'error',
            'sonarjs/no-internal-api-use': 'error',
            'sonarjs/no-intrusive-permissions': 'error',
            'sonarjs/no-invalid-regexp': 'error',
            'sonarjs/no-invariant-returns': 'error',
            'sonarjs/no-inverted-boolean-check': 'error',
            'sonarjs/no-ip-forward': 'error',
            'sonarjs/no-labels': 'error',
            'sonarjs/no-literal-call': 'error',
            'sonarjs/no-mime-sniff': 'error',
            'sonarjs/no-misleading-array-reverse': 'error',
            'sonarjs/no-misleading-character-class': 'error',
            'sonarjs/no-mixed-content': 'error',
            'sonarjs/no-nested-assignment': 'error',
            'sonarjs/no-nested-conditional': 'error',
            'sonarjs/no-nested-functions': 'error',
            'sonarjs/no-nested-incdec': 'error',
            'sonarjs/no-nested-switch': 'error',
            'sonarjs/no-nested-template-literals': 'error',
            'sonarjs/no-os-command-from-path': 'error',
            'sonarjs/no-parameter-reassignment': 'error',
            'sonarjs/no-primitive-wrappers': 'error',
            'sonarjs/no-redundant-assignments': 'error',
            'sonarjs/no-redundant-boolean': 'error',
            'sonarjs/no-redundant-jump': 'error',
            'sonarjs/no-redundant-optional': 'error',
            'sonarjs/no-redundant-parentheses': 'error',
            'sonarjs/no-reference-error': 'error',
            'sonarjs/no-regex-spaces': 'error',
            'sonarjs/no-require-or-define': 'error',
            'sonarjs/no-return-type-any': 'error',
            'sonarjs/no-same-argument-assert': 'error',
            'sonarjs/no-same-line-conditional': 'error',
            'sonarjs/no-selector-parameter': 'error',
            'sonarjs/no-skipped-tests': 'error',
            'sonarjs/no-small-switch': 'error',
            'sonarjs/no-sonar-comments': 'error',
            'sonarjs/no-tab': 'error',
            'sonarjs/no-table-as-layout': 'error',
            'sonarjs/no-try-promise': 'error',
            'sonarjs/no-undefined-argument': 'error',
            'sonarjs/no-undefined-assignment': 'error',
            'sonarjs/no-unenclosed-multiline-block': 'error',
            'sonarjs/no-uniq-key': 'error',
            'sonarjs/no-unsafe-unzip': 'error',
            'sonarjs/no-unthrown-error': 'error',
            'sonarjs/no-unused-collection': 'error',
            'sonarjs/no-unused-function-argument': 'error',
            'sonarjs/no-unused-vars': 'error',
            'sonarjs/no-use-of-empty-return-value': 'error',
            'sonarjs/no-useless-catch': 'error',
            'sonarjs/no-useless-increment': 'error',
            'sonarjs/no-useless-intersection': 'error',
            'sonarjs/no-useless-react-setstate': 'error',
            'sonarjs/no-variable-usage-before-declaration': 'error',
            'sonarjs/no-vue-bypass-sanitization': 'error',
            'sonarjs/no-weak-cipher': 'error',
            'sonarjs/no-weak-keys': 'error',
            'sonarjs/no-wildcard-import': 'error',
            'sonarjs/non-existent-operator': 'error',
            'sonarjs/non-number-in-arithmetic-expression': 'error',
            'sonarjs/null-dereference': 'error',
            'sonarjs/object-alt-content': 'error',
            'sonarjs/operation-returning-nan': 'error',
            'sonarjs/os-command': 'error',
            'sonarjs/post-message': 'error',
            'sonarjs/prefer-default-last': 'error',
            'sonarjs/prefer-immediate-return': 'error',
            'sonarjs/prefer-object-literal': 'error',
            'sonarjs/prefer-promise-shorthand': 'error',
            'sonarjs/prefer-read-only-props': 'error',
            'sonarjs/prefer-regexp-exec': 'error',
            'sonarjs/prefer-single-boolean-return': 'error',
            'sonarjs/prefer-type-guard': 'error',
            'sonarjs/prefer-while': 'error',
            'sonarjs/process-argv': 'error',
            'sonarjs/production-debug': 'error',
            'sonarjs/pseudo-random': 'error',
            'sonarjs/public-static-readonly': 'error',
            'sonarjs/publicly-writable-directories': 'error',
            'sonarjs/reduce-initial-value': 'error',
            'sonarjs/redundant-type-aliases': 'error',
            'sonarjs/regex-complexity': 'error',
            'sonarjs/regular-expr': 'error',
            'sonarjs/session-regeneration': 'error',
            'sonarjs/shorthand-property-grouping': 'error',
            'sonarjs/single-char-in-character-classes': 'error',
            'sonarjs/single-character-alternation': 'error',
            'sonarjs/slow-regex': 'error',
            'sonarjs/sockets': 'error',
            'sonarjs/sql-queries': 'error',
            'sonarjs/stable-tests': 'error',
            'sonarjs/standard-input': 'error',
            'sonarjs/stateful-regex': 'error',
            'sonarjs/strict-transport-security': 'error',
            'sonarjs/strings-comparison': 'error',
            'sonarjs/super-invocation': 'error',
            'sonarjs/table-header': 'error',
            'sonarjs/table-header-reference': 'error',
            'sonarjs/test-check-exception': 'error',
            'sonarjs/todo-tag': 'error',
            'sonarjs/too-many-break-or-continue-in-loop': 'error',
            'sonarjs/unicode-aware-regex': 'error',
            'sonarjs/unused-import': 'error',
            'sonarjs/unused-named-groups': 'error',
            'sonarjs/unverified-certificate': 'error',
            'sonarjs/unverified-hostname': 'error',
            'sonarjs/updated-const-var': 'error',
            'sonarjs/updated-loop-counter': 'error',
            'sonarjs/use-type-alias': 'error',
            'sonarjs/useless-string-operation': 'error',
            'sonarjs/values-not-convertible-to-numbers': 'error',
            'sonarjs/variable-name': 'error',
            'sonarjs/void-use': 'error',
            'sonarjs/weak-ssl': 'error',
            'sonarjs/web-sql-database': 'error',
            'sonarjs/x-powered-by': 'error',
            'sonarjs/xml-parser-xxe': 'error',
            'sonarjs/xpath': 'error',
            // Security Rules
            'security/detect-bidi-characters': 'error',
            'security/detect-buffer-noassert': 'error',
            'security/detect-child-process': 'error',
            'security/detect-disable-mustache-escape': 'error',
            'security/detect-eval-with-expression': 'error',
            'security/detect-new-buffer': 'error',
            'security/detect-no-csrf-before-method-override': 'error',
            'security/detect-non-literal-fs-filename': 'error',
            'security/detect-non-literal-regexp': 'error',
            'security/detect-non-literal-require': 'error',
            'security/detect-object-injection': 'error',
            'security/detect-possible-timing-attacks': 'error',
            'security/detect-pseudoRandomBytes': 'error',
            'security/detect-unsafe-regex': 'error',
            // Boundaries Rules
            'boundaries/element-types': [
                'error',
                {
                    default: 'disallow',
                    rules: [
                        // Shell can import from lib and features (orchestration layer)
                        {
                            from: 'shell',
                            allow: ['shell', 'lib-core', 'lib-domain', 'lib-infrastructure', 'lib-presentation', 'feature']
                        },
                        // Lib core is the lowest layer (no imports from app code)
                        {
                            from: 'lib-core',
                            allow: ['lib-core']
                        },
                        // Lib domain is framework-agnostic (pure TypeScript only)
                        {
                            from: 'lib-domain',
                            allow: ['lib-core', 'lib-domain']
                        },
                        // Lib infrastructure is framework-agnostic (can use lib-domain)
                        {
                            from: 'lib-infrastructure',
                            allow: ['lib-core', 'lib-domain', 'lib-infrastructure']
                        },
                        // Lib presentation can use Angular and lower layers
                        {
                            from: 'lib-presentation',
                            allow: ['lib-core', 'lib-domain', 'lib-infrastructure', 'lib-presentation']
                        },
                        // Feature domain is framework-agnostic (pure TypeScript)
                        {
                            from: 'feature-domain',
                            allow: [
                                'lib-core',
                                'lib-domain',
                                ['feature-core', { featureName: '${from.featureName}' }],
                                ['feature-domain', { featureName: '${from.featureName}' }]
                            ]
                        },
                        // Feature infrastructure is framework-agnostic (can use domain)
                        {
                            from: 'feature-infrastructure',
                            allow: [
                                'lib-core',
                                'lib-domain',
                                'lib-infrastructure',
                                ['feature-core', { featureName: '${from.featureName}' }],
                                ['feature-domain', { featureName: '${from.featureName}' }],
                                ['feature-infrastructure', { featureName: '${from.featureName}' }]
                            ]
                        },
                        // Feature presentation is Angular-specific (can use all layers)
                        {
                            from: 'feature-presentation',
                            allow: [
                                'lib-core',
                                'lib-domain',
                                'lib-infrastructure',
                                'lib-presentation',
                                ['feature-core', { featureName: '${from.featureName}' }],
                                ['feature-domain', { featureName: '${from.featureName}' }],
                                ['feature-infrastructure', { featureName: '${from.featureName}' }],
                                ['feature-presentation', { featureName: '${from.featureName}' }]
                            ]
                        },
                        // Feature core is framework-agnostic (lowest feature layer)
                        {
                            from: 'feature-core',
                            allow: [
                                'lib-core',
                                ['feature-core', { featureName: '${from.featureName}' }]
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
                        // Features must export through index.ts
                        {
                            target: 'feature',
                            allow: 'index.ts'
                        },
                        // Internal feature files allowed
                        {
                            target: ['feature-core', 'feature-domain', 'feature-infrastructure', 'feature-presentation'],
                            allow: '**'
                        },
                        // Lib sublayers allow all imports
                        {
                            target: ['lib-core', 'lib-domain', 'lib-infrastructure', 'lib-presentation', 'shell'],
                            allow: '**'
                        }
                    ]
                }
            ],
            'boundaries/external': [
                'error',
                {
                    default: 'allow',
                    rules: [
                        // Core cannot import Angular
                        {
                            from: 'lib-core',
                            disallow: ['@angular/**'],
                            message: 'Core layer cannot import Angular. Keep core utilities framework-agnostic.'
                        },
                        // Domain cannot import Angular
                        {
                            from: 'lib-domain',
                            disallow: ['@angular/**'],
                            message: 'Domain layer cannot import Angular. Keep domain logic framework-agnostic.'
                        },
                        // Infrastructure cannot import Angular
                        {
                            from: 'lib-infrastructure',
                            disallow: ['@angular/**'],
                            message: 'Infrastructure layer cannot import Angular. Keep infrastructure framework-agnostic.'
                        },
                        // Feature core cannot import Angular
                        {
                            from: 'feature-core',
                            disallow: ['@angular/**'],
                            message: 'Feature core layer cannot import Angular. Keep core utilities framework-agnostic.'
                        },
                        // Feature domain cannot import Angular
                        {
                            from: 'feature-domain',
                            disallow: ['@angular/**'],
                            message: 'Feature domain layer cannot import Angular. Keep domain logic framework-agnostic.'
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
        }
    },
    {
        files: ['**/*.spec.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.spec.json'
            },
            globals: {
                ...vitest.environments.env.globals
            }
        },
        plugins: {
            '@angular-eslint': angularEslint,
            '@typescript-eslint': tseslint.plugin,
            vitest
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.spec.json'
                }
            },
            vitest: {
                typecheck: true
            }
        },
        rules: {
            // TypeScript ESLint Rules
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/init-declarations': 'off',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow'
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow'
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
            '@typescript-eslint/no-magic-numbers': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-type-assertion': 'off',
            // Import Rules
            'import/no-internal-modules': 'off',
            'import/no-restricted-paths': [
                'error',
                {
                    zones: [
                        {
                            target: './src/**/*.spec.ts',
                            from: './src/testing/e2e/**',
                            message: 'Unit tests (*.spec.ts) cannot import from testing/e2e. Use *.e2e.spec.ts for E2E tests.'
                        },
                        {
                            target: './src/**/*.e2e.spec.ts',
                            from: './src/testing/unit/**',
                            message: 'E2E tests (*.e2e.spec.ts) cannot import from testing/unit. Use *.spec.ts for unit tests.'
                        }
                    ]
                }
            ],
            // Promise Rules
            'promise/avoid-new': 'off',
            // SonarJS Rules
            'sonarjs/max-lines-per-function': 'off',
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-nested-functions': 'off',
            // Vitest Rules
            'vitest/consistent-test-filename': [
                'error',
                {
                    pattern: String.raw`.*\.spec\.ts$`
                }
            ],
            'vitest/consistent-test-it': [
                'error',
                {
                    fn: 'test'
                }
            ],
            'vitest/consistent-vitest-vi': 'error',
            'vitest/expect-expect': 'error',
            'vitest/hoisted-apis-on-top': 'error',
            'vitest/max-expects': 'error',
            'vitest/max-nested-describe': 'error',
            'vitest/no-alias-methods': 'error',
            'vitest/no-commented-out-tests': 'error',
            'vitest/no-conditional-expect': 'error',
            'vitest/no-conditional-in-test': 'error',
            'vitest/no-conditional-tests': 'error',
            'vitest/no-disabled-tests': 'error',
            'vitest/no-duplicate-hooks': 'error',
            'vitest/no-focused-tests': 'error',
            'vitest/no-hooks': 'error',
            'vitest/no-identical-title': 'error',
            'vitest/no-import-node-test': 'error',
            'vitest/no-importing-vitest-globals': 'error',
            'vitest/no-interpolation-in-snapshots': 'error',
            'vitest/no-large-snapshots': 'error',
            'vitest/no-mocks-import': 'error',
            'vitest/no-restricted-matchers': 'error',
            'vitest/no-restricted-vi-methods': 'error',
            'vitest/no-standalone-expect': 'error',
            'vitest/no-test-prefixes': 'error',
            'vitest/no-test-return-statement': 'error',
            'vitest/padding-around-after-all-blocks': 'error',
            'vitest/padding-around-after-each-blocks': 'error',
            'vitest/padding-around-all': 'error',
            'vitest/padding-around-before-all-blocks': 'error',
            'vitest/padding-around-before-each-blocks': 'error',
            'vitest/padding-around-describe-blocks': 'error',
            'vitest/padding-around-expect-groups': 'error',
            'vitest/padding-around-test-blocks': 'error',
            'vitest/prefer-called-exactly-once-with': 'error',
            'vitest/prefer-called-once': 'off',
            'vitest/prefer-called-times': 'error',
            'vitest/prefer-called-with': 'error',
            'vitest/prefer-comparison-matcher': 'error',
            'vitest/prefer-describe-function-title': 'error',
            'vitest/prefer-each': 'error',
            'vitest/prefer-equality-matcher': 'error',
            'vitest/prefer-expect-assertions': 'off',
            'vitest/prefer-expect-resolves': 'error',
            'vitest/prefer-expect-type-of': 'error',
            'vitest/prefer-hooks-in-order': 'error',
            'vitest/prefer-hooks-on-top': 'error',
            'vitest/prefer-import-in-mock': 'error',
            'vitest/prefer-importing-vitest-globals': 'off',
            'vitest/prefer-lowercase-title': 'error',
            'vitest/prefer-mock-promise-shorthand': 'error',
            'vitest/prefer-snapshot-hint': 'error',
            'vitest/prefer-spy-on': 'error',
            'vitest/prefer-strict-boolean-matchers': 'error',
            'vitest/prefer-strict-equal': 'error',
            'vitest/prefer-to-be': 'error',
            'vitest/prefer-to-be-falsy': 'off',
            'vitest/prefer-to-be-object': 'error',
            'vitest/prefer-to-be-truthy': 'off',
            'vitest/prefer-to-contain': 'error',
            'vitest/prefer-to-have-length': 'error',
            'vitest/prefer-todo': 'error',
            'vitest/prefer-vi-mocked': 'error',
            'vitest/require-awaited-expect-poll': 'error',
            'vitest/require-hook': 'off',
            'vitest/require-local-test-context-for-concurrent-snapshots': 'error',
            'vitest/require-mock-type-parameters': 'error',
            'vitest/require-to-throw-message': 'error',
            'vitest/require-top-level-describe': 'error',
            'vitest/valid-describe-callback': 'error',
            'vitest/valid-expect': 'error',
            'vitest/valid-expect-in-promise': 'error',
            'vitest/valid-title': 'error',
            'vitest/warn-todo': 'error'
        }
    },
    {
        files: ['**/testing/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.spec.json'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.spec.json'
                }
            }
        },
        rules: {
            // Allow direct vitest imports in testing utilities (adapter layer)
            'no-restricted-imports': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unsafe-type-assertion': 'off',
            'import/no-internal-modules': [
                'error',
                {
                    allow: [
                        '@angular/core/testing',
                        'vitest/browser'
                    ]
                }
            ]
        }
    },
    {
        files: ['vitest*.config.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.spec.json'
            }
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.spec.json'
                }
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin
        },
        rules: {
            'import/no-default-export': 'off',
            'import/no-extraneous-dependencies': 'off',
            'import/no-internal-modules': 'off',
            '@typescript-eslint/no-magic-numbers': 'off'
        }
    },
    {
        files: ['**/*.html'],
        ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.angular/**'],
        languageOptions: {
            parser: angularTemplateParser
        },
        plugins: {
            '@angular-eslint/template': angularTemplateEslint
        },
        rules: {
            ...angularTemplateEslint.configs.recommended.rules,
            ...angularTemplateEslint.configs.accessibility.rules,
            // Angular Template Rules
            '@angular-eslint/template/alt-text': 'error',
            '@angular-eslint/template/attributes-order': 'error',
            '@angular-eslint/template/banana-in-box': 'error',
            '@angular-eslint/template/button-has-type': 'error',
            '@angular-eslint/template/click-events-have-key-events': 'error',
            '@angular-eslint/template/conditional-complexity': [
                'error',
                {
                    maxComplexity: 5
                }
            ],
            '@angular-eslint/template/cyclomatic-complexity': [
                'error',
                {
                    maxComplexity: 10
                }
            ],
            '@angular-eslint/template/elements-content': 'error',
            '@angular-eslint/template/eqeqeq': 'error',
            '@angular-eslint/template/i18n': 'off',
            '@angular-eslint/template/interactive-supports-focus': 'error',
            '@angular-eslint/template/label-has-associated-control': 'error',
            '@angular-eslint/template/mouse-events-have-key-events': 'error',
            '@angular-eslint/template/no-any': 'error',
            '@angular-eslint/template/no-autofocus': 'error',
            '@angular-eslint/template/no-call-expression': 'off',
            '@angular-eslint/template/no-distracting-elements': 'error',
            '@angular-eslint/template/no-duplicate-attributes': 'error',
            '@angular-eslint/template/no-empty-control-flow': 'error',
            '@angular-eslint/template/no-inline-styles': 'error',
            '@angular-eslint/template/no-interpolation-in-attributes': 'error',
            '@angular-eslint/template/no-negated-async': 'error',
            '@angular-eslint/template/no-nested-tags': 'error',
            '@angular-eslint/template/no-positive-tabindex': 'error',
            '@angular-eslint/template/prefer-at-else': 'error',
            '@angular-eslint/template/prefer-at-empty': 'error',
            '@angular-eslint/template/prefer-built-in-pipes': 'error',
            '@angular-eslint/template/prefer-contextual-for-variables': 'error',
            '@angular-eslint/template/prefer-control-flow': 'error',
            '@angular-eslint/template/prefer-ngsrc': 'error',
            '@angular-eslint/template/prefer-self-closing-tags': 'error',
            '@angular-eslint/template/prefer-static-string-properties': 'error',
            '@angular-eslint/template/prefer-template-literal': 'error',
            '@angular-eslint/template/role-has-required-aria': 'error',
            '@angular-eslint/template/table-scope': 'error',
            '@angular-eslint/template/use-track-by-function': 'error',
            '@angular-eslint/template/valid-aria': 'error'
        }
    },
    {
        files: ['vitest*.config.ts'],
        rules: {
            'sonarjs/no-empty-test-file': 'off'
        }
    }
];
