module.exports = exports = {
  endOfLine: 'lf',
  printWidth: 140,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
  overrides: [
    {
      files: '*.json',
      options: {
        trailingComma: 'none',
      }
    }
  ],
};
