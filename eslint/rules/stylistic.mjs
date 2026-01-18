export const stylisticRules = {
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
        'separate-lines'
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
    '@stylistic/type-annotation-spacing': 'error',
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
    ]
};
