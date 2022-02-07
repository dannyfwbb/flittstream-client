const OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  plugins: [
    'html',
    'file-progress',
  ],
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  ignorePatterns: [
    'dist/',
    '*.json',
  ],
  rules: {
    'file-progress/activate': 1,
    quotes: [
      ERROR,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'arrow-parens': ERROR,
    'no-lonely-if': WARN,
    'no-prototype-builtins': OFF,
    'max-len': [
      ERROR,
      {
        code: 140,
        tabWidth: 2,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
      }
    ],
    indent: [
      ERROR,
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        MemberExpression: 1,
        FunctionDeclaration: {
          parameters: 'first',
          body: 1
        },
        FunctionExpression: {
          parameters: 'first',
          body: 1
        },
        CallExpression: {
          arguments: 'first'
        },
        ArrayExpression: 'first',
        ObjectExpression: 'first',
      }
    ]
  },
  overrides: [
    {
      files: ['*.ts'],
      plugins: [
        '@typescript-eslint',
        '@angular-eslint/eslint-plugin',
        'rxjs',
        'rxjs-angular',
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        //// uncomment next line to get tsunami of 'any no-no-no' errors :)
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@angular-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          'tsconfig.*.json',
          'e2e/tsconfig.json',
        ],
        createDefaultProgram: true
      },
      rules: {
        'arrow-parens': ERROR,
        'max-len': [
          ERROR,
          {
            code: 140,
            tabWidth: 2,
            ignoreStrings: true,
            ignoreUrls: true,
            ignoreRegExpLiterals: true,
            ignoreTemplateLiterals: true,
            ignorePattern: '/^import\\s.+?\\sfrom\\s.+;$/',
          }
        ],
        '@typescript-eslint/no-unused-vars': [
          ERROR,
          {
            argsIgnorePattern: '^_',
          }
        ],
        '@angular-eslint/directive-selector': [
          ERROR,
          {
            type: 'attribute',
            prefix: ['app', 'ose'],
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          ERROR,
          {
            type: 'element',
            prefix: ['app', 'ose'],
            style: 'kebab-case'
          }
        ],
        'rxjs-angular/prefer-async-pipe': OFF,
        'rxjs-angular/prefer-composition': OFF,
        'rxjs-angular/prefer-takeuntil': [
          ERROR,
          {
            alias: [
              'untilDestroyed',
              'untilDestroy',
            ],
          }
        ],
        'rxjs/finnish': [
          ERROR,
          {
            functions: false,
            methods: false,
            parameters: true,
            properties: true,
            variables: true
          }
        ],
        'rxjs/no-unsafe-switchmap': ERROR,
        'rxjs/no-unsafe-takeuntil': ERROR,
        'rxjs/just': WARN,
        'rxjs/no-async-subscribe': ERROR,
        'rxjs/no-nested-subscribe': WARN,
        'rxjs/no-subject-unsubscribe': ERROR,
        'rxjs/no-index': ERROR,
        'rxjs/no-unsafe-catch': ERROR,
        'rxjs/no-topromise': ERROR,
        'rxjs/prefer-observer': WARN,
        'rxjs/no-internal': ERROR,
        'rxjs/no-subject-value': ERROR,
      }
    },
    /**
     * angular component templates (html)
     */
    {
      files: ['*.component.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
      },
    },
    /**
     * angular component templates inline (ts)
     */
    {
      files: ['*.component.ts'],
      extends: ['plugin:@angular-eslint/template/process-inline-templates'],
      processor: '@angular-eslint/template/extract-inline-html',
      rules: {
      },
    },
  ],
};
