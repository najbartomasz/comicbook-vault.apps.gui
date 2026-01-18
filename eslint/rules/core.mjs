export const coreRules = {
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
    'no-await-in-loop': 'off',
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
    ]
};
