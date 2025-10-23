const js = require('@eslint/js')

module.exports = [
  { ignores: ['node_modules/**', 'lib/**'] },

  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    ...js.configs.recommended,
    rules: {
      quotes: ['error', 'double', { allowTemplateLiterals: true }],
      'prefer-arrow-callback': 'error',
      'no-restricted-globals': ['error', 'name', 'length'],
    },
  },
]
