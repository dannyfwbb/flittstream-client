module.exports = exports = {
  plugins: [
    'stylelint-order',
    'stylelint-scss'
  ],
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-config-hudochenkov/full',
    'stylelint-config-prettier',
  ],
  ignoreFiles: [
    '**/*.ts',
    '**/*.js'
  ],
  rules: {
    'max-nesting-depth': 5,
    'at-rule-no-unknown': null,
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)([-_]+[a-z0-9]+)*$',
      {
        resolveNestedSelectors: true
      }
    ],
    'selector-no-qualifying-type': [true, {
        ignore: ['attribute', 'class', 'id']
      }],
    'selector-type-no-unknown': [true, {
        ignoreNamespaces: ['/^app-/', '/^ose-/', '/^mat-/'],
        ignoreTypes: ['/^app-/', '/^ose-/', '/^mat-/']
      }],
    'selector-pseudo-element-no-unknown': [true, {
        ignorePseudoElements: ['ng-deep']
      }],
    'selector-max-type': 3,
    'selector-max-id': 0,
    'selector-max-compound-selectors': 6,
    'no-descending-specificity': [true, {
      ignore: ['selectors-within-list']
    }],
    'function-parentheses-space-inside': 'never-single-line',
    'value-keyword-case': null,
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-colon-newline-after': null,
    'scss/at-import-no-partial-leading-underscore': null,
    'order/properties-alphabetical-order': null
  },
  defaultSeverity: 'warning'
};
